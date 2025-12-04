"""Experience calculation constants and functions."""

from volunteers.models.attendance import Attendance

# Attendance weights for experience calculation
ATTENDANCE_MAP = {
    Attendance.YES: 1.0,
    Attendance.LATE: 0.5,
    Attendance.NO: 0.0,
    Attendance.SICK: 0.0,
    Attendance.UNKNOWN: 0.0,
}

# Position multipliers for experience calculation
# TODO: Update this dict with actual position names and their multipliers
POSITION_MULTIPLIER = {
    # Default multiplier for unknown positions
    "_default": 1.0,
}


def get_position_multiplier(position_name: str) -> float:
    """Get multiplier for a position name.

    Args:
        position_name: Name of the position

    Returns:
        Multiplier value for the position
    """
    return POSITION_MULTIPLIER.get(position_name, POSITION_MULTIPLIER["_default"])


# Rank thresholds
RANK_THRESHOLDS = {
    "volunteer": 0.0,
    "bronze_volunteer": 1.0,
    "silver_volunteer": 2.0,
}


def get_rank(experience: float) -> str:
    """Get rank name for given experience value.

    Args:
        experience: Total experience value

    Returns:
        Rank name (e.g., 'volunteer', 'bronze_volunteer', etc.)
    """
    # Sort thresholds in descending order to find the highest matching rank
    sorted_ranks = sorted(RANK_THRESHOLDS.items(), key=lambda x: x[1], reverse=True)

    for rank_name, threshold in sorted_ranks:
        if experience >= threshold:
            return rank_name

    return "Volunteer"  # Default rank
