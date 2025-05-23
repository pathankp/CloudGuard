import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

class Client(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    contact_info = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Server(models.Model):
    unique_id = models.CharField(max_length=255, unique=True, primary_key=True)
    hostname = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField()
    specs = models.JSONField()  # To store CPU, RAM, disk, etc.
    status = models.CharField(max_length=50, default='unknown')
    agent_id = models.CharField(max_length=255, null=True, blank=True)
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.hostname

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('staff', 'Staff'),
        ('client', 'Client'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')

class Agent(models.Model):
    agent_id = models.CharField(max_length=255, unique=True, primary_key=True)
    server = models.OneToOneField(Server, on_delete=models.CASCADE, null=True, blank=True)
    last_heartbeat = models.DateTimeField(null=True, blank=True)
    version = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.agent_id

class ResourceUsage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    server = models.ForeignKey(Server, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    cpu_usage = models.FloatField()  # e.g., percentage
    ram_usage = models.FloatField()  # e.g., percentage or MB
    disk_usage = models.JSONField()  # e.g., {'/': {'total': '100GB', 'used': '50GB'}}
    bandwidth_usage = models.JSONField()  # e.g., {'incoming': '1TB', 'outgoing': '500GB'}
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.server.hostname} - {self.timestamp}"
