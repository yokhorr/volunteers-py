from pydantic import BaseModel, Field

from volunteers.schemas.base import BaseSuccessResponse


class AddAssessmentRequest(BaseModel):
    user_day_id: int
    comment: str
    value: float = Field(description="Assessment value (any real number)")


class AddAssessmentResponse(BaseSuccessResponse):
    assessment_id: int


class EditAssessmentRequest(BaseModel):
    comment: str | None = None
    value: float | None = Field(
        None,
        description="Assessment value (any real number)",
    )


class AssessmentItem(BaseModel):
    assessment_id: int
    user_day_id: int
    comment: str
    value: float


class AssessmentsResponse(BaseModel):
    assessments: list[AssessmentItem]
