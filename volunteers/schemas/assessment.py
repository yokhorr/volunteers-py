from pydantic import BaseModel, Field


class AssessmentIn(BaseModel):
    user_day_id: int
    comment: str
    value: int = Field(ge=0, le=10, description="Assessment value from 0 to 10")


class AssessmentEditIn(BaseModel):
    comment: str | None
    value: int | None = Field(None, ge=0, le=10, description="Assessment value from 0 to 10")


class AssessmentOut(AssessmentIn):
    assessment_id: int
