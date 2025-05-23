from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Server, Client, Agent, ResourceUsage
from .serializers import ServerSerializer, ClientSerializer, ResourceUsageSerializer

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated] # Protect this viewset

class ServerViewSet(viewsets.ModelViewSet):
    queryset = Server.objects.all()
    serializer_class = ServerSerializer
    permission_classes = [IsAuthenticated] # Protect this viewset

class AIChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_message = request.data.get('message')
        if not user_message:
            return Response(
                {"error": "No message provided."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Placeholder AI response
        ai_reply = f"AI response placeholder: You said '{user_message}'. Full AI integration is pending."
        
        return Response({"reply": ai_reply}, status=status.HTTP_200_OK)

class AgentHeartbeatView(APIView):
    permission_classes = [IsAuthenticated] # Requires token authentication

    def post(self, request, *args, **kwargs):
        data = request.data
        agent_id = data.get('agent_id')
        server_unique_id = data.get('server_unique_id')
        timestamp_str = data.get('timestamp') # Assuming ISO 8601

        if not all([agent_id, server_unique_id, timestamp_str]):
            return Response(
                {"error": "Missing required fields: agent_id, server_unique_id, timestamp"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            agent = Agent.objects.get(agent_id=agent_id)
        except Agent.DoesNotExist:
            return Response(
                {"error": f"Agent with ID '{agent_id}' not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Update agent's last heartbeat
        agent.last_heartbeat = timezone.now()
        
        try:
            server = Server.objects.get(unique_id=server_unique_id)
        except Server.DoesNotExist:
            # Log this, but agent heartbeat can still be updated
            print(f"Warning: Server with unique_id '{server_unique_id}' not found for heartbeat from agent '{agent_id}'.")
            server = None # Set server to None if not found

        # If server is found, create ResourceUsage record
        if server:
            resource_data = {
                'server': server.pk, # Use server's primary key
                'timestamp': timestamp_str,
                'cpu_usage': data.get('cpu_usage'),
                'ram_usage': data.get('ram_usage'),
                'disk_usage': data.get('disk_usage', {}),
                'bandwidth_usage': data.get('bandwidth_usage', {})
            }
            
            # Validate that cpu_usage and ram_usage are floats if provided
            for field in ['cpu_usage', 'ram_usage']:
                if resource_data[field] is not None:
                    try:
                        resource_data[field] = float(resource_data[field])
                    except ValueError:
                        return Response(
                            {"error": f"Invalid data type for {field}. Expected float."},
                            status=status.HTTP_400_BAD_REQUEST
                        )
            
            # Minimal validation for disk_usage and bandwidth_usage (should be dicts)
            if not isinstance(resource_data['disk_usage'], dict):
                 return Response({"error": "disk_usage must be a JSON object."}, status=status.HTTP_400_BAD_REQUEST)
            if not isinstance(resource_data['bandwidth_usage'], dict):
                 return Response({"error": "bandwidth_usage must be a JSON object."}, status=status.HTTP_400_BAD_REQUEST)


            resource_serializer = ResourceUsageSerializer(data=resource_data)
            if resource_serializer.is_valid():
                resource_serializer.save(server=server) # Ensure server instance is passed
                agent.server = server # Associate agent with this server if not already or if it changed
                agent.save()
                return Response(
                    {"status": "heartbeat received", "resource_usage_id": resource_serializer.instance.id},
                    status=status.HTTP_201_CREATED
                )
            else:
                # Log the validation errors for debugging
                print(f"ResourceUsageSerializer errors: {resource_serializer.errors}")
                # If server was found but resource data is invalid, still save agent heartbeat
                agent.save()
                return Response(
                    {"error": "Invalid resource usage data", "details": resource_serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else: # Server not found
            agent.save() # Still save the agent's heartbeat
            return Response(
                {"status": "heartbeat received, server not found, resource usage not recorded"},
                status=status.HTTP_200_OK 
            )
