-- Function to upsert interest weights
CREATE OR REPLACE FUNCTION upsert_interest_weight(
    p_user_id UUID,
    p_tag TEXT,
    p_increment DECIMAL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO interest_weights (user_id, tag, weight, updated_at)
    VALUES (p_user_id, p_tag, p_increment, NOW())
    ON CONFLICT (user_id, tag)
    DO UPDATE SET
        weight = interest_weights.weight + p_increment,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
