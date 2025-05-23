from rest_framework import serializers
from .models import Server, Client, ResourceUsage, Agent

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class ResourceUsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceUsage
        fields = '__all__'
        read_only_fields = ('recorded_at',) # Should be set by the server

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = '__all__'

class ServerSerializer(serializers.ModelSerializer):
    last_cpu_usage = serializers.SerializerMethodField()
    last_ram_usage = serializers.SerializerMethodField()
    last_disk_usage_summary = serializers.SerializerMethodField() # e.g. root partition usage
    last_heartbeat_timestamp = serializers.SerializerMethodField()

    class Meta:
        model = Server
        fields = [
            'unique_id', 'hostname', 'ip_address', 'specs', 'status', 
            'client', 'created_at', 'updated_at',
            'last_cpu_usage', 'last_ram_usage', 'last_disk_usage_summary', 
            'last_heartbeat_timestamp'
        ]
        # Ensure unique_id is treated as the primary key for lookup in DRF if it's not pk on model
        # lookup_field = 'unique_id' 


    def get_latest_resource_usage(self, obj):
        return obj.resourceusage_set.order_by('-timestamp').first()

    def get_last_cpu_usage(self, obj):
        latest_usage = self.get_latest_resource_usage(obj)
        return f"{latest_usage.cpu_usage:.2f}%" if latest_usage and latest_usage.cpu_usage is not None else "N/A"

    def get_last_ram_usage(self, obj):
        latest_usage = self.get_latest_resource_usage(obj)
        return f"{latest_usage.ram_usage:.2f}%" if latest_usage and latest_usage.ram_usage is not None else "N/A"

    def get_last_disk_usage_summary(self, obj):
        latest_usage = self.get_latest_resource_usage(obj)
        if latest_usage and latest_usage.disk_usage:
            # Example: return usage for '/' partition if available
            root_usage = latest_usage.disk_usage.get('/')
            if root_usage and isinstance(root_usage, dict) and 'used' in root_usage and 'total' in root_usage:
                return f"{root_usage['used']}/{root_usage['total']}"
            # Fallback to string representation of the whole JSON if '/' not found or malformed
            return str(latest_usage.disk_usage) 
        return "N/A"
        
    def get_last_heartbeat_timestamp(self, obj):
        # Accessing the related Agent instance from Server
        # If Agent has a OneToOneField to Server named 'server',
        # then Server will have a reverse relation named 'agent' (lowercase model name)
        try:
            if hasattr(obj, 'agent') and obj.agent and obj.agent.last_heartbeat:
                return obj.agent.last_heartbeat.isoformat()
        except Agent.DoesNotExist: # Should not happen with OneToOne if correctly set up, but good for safety
            pass # Fall through to resource usage timestamp
        
        # Fallback to latest resource usage timestamp if agent info not direct or not available
        latest_usage = self.get_latest_resource_usage(obj)
        if latest_usage:
            return latest_usage.timestamp.isoformat()
        return "N/A"
