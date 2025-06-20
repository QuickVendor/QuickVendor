from django.db import models


class TimeStampedModel(models.Model):
    """
    Abstract base model that provides self-updating 'created_at' and 'updated_at' fields.
    """
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the record was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the record was last updated"
    )

    class Meta:
        abstract = True
        ordering = ['-created_at']  # Default ordering by newest first

    def __str__(self):
        """
        String representation showing the class name and creation timestamp.
        """
        return f"{self.__class__.__name__} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class BaseModel(TimeStampedModel):
    """
    Extended abstract base model with additional common functionality.
    Inherits timestamp fields from TimeStampedModel.
    """
    is_active = models.BooleanField(
        default=True,
        help_text="Designates whether this record should be treated as active"
    )

    class Meta:
        abstract = True

    def __str__(self):
        """
        String representation showing active status and timestamp.
        """
        status = "Active" if self.is_active else "Inactive"
        return f"{self.__class__.__name__} ({status}) - {self.created_at.strftime('%Y-%m-%d')}"

    def soft_delete(self):
        """
        Soft delete by setting is_active to False instead of actually deleting.
        """
        self.is_active = False
        self.save(update_fields=['is_active', 'updated_at'])

    def restore(self):
        """
        Restore a soft-deleted record by setting is_active to True.
        """
        self.is_active = True
        self.save(update_fields=['is_active', 'updated_at'])