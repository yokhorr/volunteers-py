"""add_photo_fields_to_user

Revision ID: 3d81aecb66a0
Revises: 8e31dc6646bd
Create Date: 2025-12-01 20:33:27.705373

"""

from collections.abc import Sequence

# revision identifiers, used by Alembic.
revision: str = "3d81aecb66a0"
down_revision: str | None = "8e31dc6646bd"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""


def downgrade() -> None:
    """Downgrade schema."""
