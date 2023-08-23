from rest_framework import serializers
 
class BankAccountSerializer(serializers.Serializer):
    account_id = serializers.CharField(max_length=255)
    name = serializers.CharField(max_length=255)
    email = serializers.CharField(max_length=255)
    balance = serializers.FloatField()
    created_at = serializers.DateTimeField()

    class Meta:
        fields = ('account_id', 'name', 'email', 'balance', 'created_at')
        extra_kwargs = {'created_at': {'required': False}} 