from pydantic import BaseModel, Field

from volunteers.schemas.base import BaseSuccessResponse


class AddAssessmentRequest(BaseModel):
    user_day_id: int
    comment: str
    value: int = Field(ge=0, le=10, description="Assessment value from 0 to 10")


class AddAssessmentResponse(BaseSuccessResponse):
    assessment_id: int


class EditAssessmentRequest(BaseModel):
    comment: str | None = None
    value: int | None = Field(None, ge=0, le=10, description="Assessment value from 0 to 10")


class AssessmentItem(BaseModel):
    assessment_id: int
    user_day_id: int
    comment: str
    value: int


class AssessmentsResponse(BaseModel):
    assessments: list[AssessmentItem]
