import random
import string
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ShortURL
from .serializers import ShortURLSerializer, ShortURLStatsSerializer

def generate_short_code(length=6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def generate_unique_short_code():
    while True:
        code = generate_short_code()
        if not ShortURL.objects.filter(short_code=code).exists():
            return code

class ShortURListAPIView(APIView):
    def get(self, request):
        short_urls = ShortURL.objects.all()
        serializer = ShortURLSerializer(short_urls, many=True)
        return Response(serializer.data)

class ShortURLCreateAPIView(APIView):
    def post(self, request):
        serializer = ShortURLSerializer(data=request.data)
        if serializer.is_valid():
            short_code = generate_unique_short_code()
            short_url = ShortURL.objects.create(
                url=serializer.validated_data['url'],
                short_code=short_code
            )
            response_serializer = ShortURLSerializer(short_url)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ShortURLDetailAPIView(APIView):
    def get_object(self, short_code):
        try:
            return ShortURL.objects.get(short_code=short_code)
        except ShortURL.DoesNotExist:
            raise Http404

    def get(self, request, short_code):
        short_url = self.get_object(short_code)
        short_url.access_count += 1
        short_url.save()
        serializer = ShortURLSerializer(short_url)
        return Response(serializer.data)

    def put(self, request, short_code):
        short_url = self.get_object(short_code)
        serializer = ShortURLSerializer(short_url, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, short_code):
        short_url = self.get_object(short_code)
        short_url.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ShortURLStatsAPIView(APIView):
    def get_object(self, short_code):
        try:
            return ShortURL.objects.get(short_code=short_code)
        except ShortURL.DoesNotExist:
            raise Http404

    def get(self, request, short_code):
        short_url = self.get_object(short_code)
        serializer = ShortURLStatsSerializer(short_url)
        return Response(serializer.data)
