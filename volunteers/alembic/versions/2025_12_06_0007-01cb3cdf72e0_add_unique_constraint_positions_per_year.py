"""Add unique constraint for positions per year

Revision ID: 0ebd08ab76a0
Revises: dd5145b00290
Create Date: 2025-12-05
"""

from alembic import op

# revision identifiers, used by Alembic.
revision = "0ebd08ab76a0"
down_revision = "dd5145b00290"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_constraint("positions_name_key", "positions", type_="unique")

    op.create_unique_constraint("positions_year_id_name_key", "positions", ["year_id", "name"])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("positions_year_id_name_key", "positions", type_="unique")

    op.create_unique_constraint("positions_name_key", "positions", ["name"])
