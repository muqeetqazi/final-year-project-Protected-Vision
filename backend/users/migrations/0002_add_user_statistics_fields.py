# Generated manually to add missing user statistics fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='total_documents_saved',
            field=models.PositiveIntegerField(default=0, help_text='Total documents uploaded/saved'),
        ),
        migrations.AddField(
            model_name='user',
            name='total_documents_processed',
            field=models.PositiveIntegerField(default=0, help_text='Total documents processed'),
        ),
        migrations.AddField(
            model_name='user',
            name='total_documents_shared',
            field=models.PositiveIntegerField(default=0, help_text='Total documents shared'),
        ),
        migrations.AddField(
            model_name='user',
            name='total_sensitive_items_detected',
            field=models.PositiveIntegerField(default=0, help_text='Total sensitive items found'),
        ),
        migrations.AddField(
            model_name='user',
            name='total_non_detected_items',
            field=models.PositiveIntegerField(default=0, help_text='Total items that were not detected as sensitive'),
        ),
    ]
