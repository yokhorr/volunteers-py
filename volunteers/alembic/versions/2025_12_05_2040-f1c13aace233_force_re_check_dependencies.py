"""force re-check dependencies

Revision ID: f1c13aace233
Revises: 81c24b11a34f
Create Date: 2025-12-05 20:40:52.185937

"""

from collections.abc import Sequence

# revision identifiers, used by Alembic.
revision: str = "f1c13aace233"
down_revision: str | None = "81c24b11a34f"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""


def downgrade() -> None:
    """Downgrade schema."""
