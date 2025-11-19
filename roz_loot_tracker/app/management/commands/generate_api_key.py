from rest_framework_api_key.models import APIKey

api_key, key = APIKey.objects.create_key(name="discord-bot")
print("***********API KEY******************")
print(key)
