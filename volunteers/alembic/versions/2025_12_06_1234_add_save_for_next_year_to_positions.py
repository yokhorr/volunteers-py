"""add save_for_next_year to positions

Revision ID: 2025_12_06_1234_add_save_for_next_year_to_positions
Revises: 2025_12_06_0007-01cb3cdf72e0_add_unique_constraint_positions_per_year
Create Date: 2025-12-06 12:34:00.000000
"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "1a2b3c4d5e6f"
down_revision = "0ebd08ab76a0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "positions",
        sa.Column(
            "save_for_next_year", sa.Boolean(), nullable=False, server_default=sa.text("false")
        ),
    )


def downgrade() -> None:
    op.drop_column("positions", "save_for_next_year")
