from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import ServerViewSet, ClientViewSet, AgentHeartbeatView # Added AgentHeartbeatView

router = DefaultRouter()
router.register(r'servers', ServerViewSet, basename='server')
router.register(r'clients', ClientViewSet, basename='client')
# router.register(r'agents', AgentViewSet, basename='agent') # If you create an AgentViewSet

from .views import ServerViewSet, ClientViewSet, AgentHeartbeatView, AIChatView # Added AIChatView

router = DefaultRouter()
router.register(r'servers', ServerViewSet, basename='server')
router.register(r'clients', ClientViewSet, basename='client')
# router.register(r'agents', AgentViewSet, basename='agent') # If you create an AgentViewSet

urlpatterns = [
    path('', include(router.urls)),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('agent/heartbeat/', AgentHeartbeatView.as_view(), name='agent_heartbeat'),
    path('ai/chat/', AIChatView.as_view(), name='ai_chat'), # Added AI Chat URL
]
