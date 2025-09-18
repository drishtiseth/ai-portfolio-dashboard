import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env
load_dotenv()

# Fetch the API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def llm_call(prompt: str) -> str:
    """
    Call OpenAI to get insights for the given prompt.
    Returns a string (either model output or fallback if no key).
    """
    if not OPENAI_API_KEY:
        # Fallback if no key is set
        return (
            "⚠️ No OPENAI_API_KEY found. Showing mock insights:\n"
            "- Risk: High tech sector concentration\n"
            "- Opportunity: Strong growth in AI-related stocks\n"
            "- Action: Diversify into other sectors"
        )

    try:
        # Initialize OpenAI client
        client = OpenAI(api_key=OPENAI_API_KEY)

        # Make a chat completion call
        response = client.chat.completions.create(
            model="gpt-4o-mini",   # fast + cheap model, good for insights
            messages=[
                {"role": "system", "content": "You are a financial analyst assistant."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=300,
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        # If API call fails, return safe fallback
        return f"⚠️ OpenAI call failed: {e}\n\nMock insights:\n- Diversify portfolio\n- Review high-volatility assets"
