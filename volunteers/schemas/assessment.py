from pydantic import BaseModel, Field


class AssessmentIn(BaseModel):
    user_day_id: int
    comment: str
    value: float = Field(description="Assessment value (any real number)")


class AssessmentEditIn(BaseModel):
    comment: str | None
    value: float | None = Field(
        None,
        description="Assessment value (any real number)",
    )


class AssessmentOut(AssessmentIn):
    assessment_id: int
