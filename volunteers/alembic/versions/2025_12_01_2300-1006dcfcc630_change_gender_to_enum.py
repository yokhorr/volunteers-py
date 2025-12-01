"""change_gender_to_enum

Revision ID: 1006dcfcc630
Revises: 3d81aecb66a0
Create Date: 2025-12-01 23:00:41.543093

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "1006dcfcc630"
down_revision: str | None = "3d81aecb66a0"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    # Drop the old enum type if it exists (from previous migration attempts)
    op.execute("DROP TYPE IF EXISTS gender_enum CASCADE")

    # Create the enum type with correct values
    gender_enum = sa.Enum("male", "female", "unspecified", name="gender_enum")
    gender_enum.create(op.get_bind(), checkfirst=False)

    # Convert existing data to lowercase to match enum values
    op.execute("""
        UPDATE users
        SET gender = CASE
            WHEN LOWER(gender) = 'male' THEN 'male'
            WHEN LOWER(gender) = 'female' THEN 'female'
            ELSE NULL
        END
        WHERE gender IS NOT NULL AND gender::text ~ '^[A-Z]'
    """)

    # Alter the column type using USING clause for PostgreSQL
    op.execute("""
        ALTER TABLE users
        ALTER COLUMN gender TYPE gender_enum
        USING COALESCE(gender::text::gender_enum, NULL)
    """)


def downgrade() -> None:
    """Downgrade schema."""
    # Convert back to string
    op.alter_column("users", "gender", type_=sa.String(), postgresql_using="gender::text")

    # Drop the enum type
    op.execute("DROP TYPE IF EXISTS gender_enum")
