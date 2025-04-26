from rest_framework import viewsets, mixins, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Document, DocumentScan
from .serializers import (
    DocumentSerializer,
    DocumentWithScansSerializer,
    DocumentScanSerializer
)


class DocumentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for documents - allows CRUD operations
    """
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['file_type', 'processed']
    search_fields = ['title']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Filter documents to return only those belonging to the current user
        """
        return Document.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        """
        Return different serializers based on the action
        """
        if self.action == 'retrieve':
            return DocumentWithScansSerializer
        return self.serializer_class
    
    @action(detail=True, methods=['get'])
    def scans(self, request, pk=None):
        """
        Return all scans for a specific document
        """
        document = self.get_object()
        scans = document.scans.all()
        serializer = DocumentScanSerializer(scans, many=True)
        return Response(serializer.data)


class DocumentScanViewSet(mixins.RetrieveModelMixin,
                          mixins.ListModelMixin,
                          viewsets.GenericViewSet):
    """
    ViewSet for document scans - read-only operations
    """
    serializer_class = DocumentScanSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['risk_level']
    ordering_fields = ['scan_date']
    ordering = ['-scan_date']
    
    def get_queryset(self):
        """
        Filter scans to return only those related to the current user's documents
        """
        return DocumentScan.objects.filter(document__user=self.request.user) 