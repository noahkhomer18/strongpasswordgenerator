import random
import string

def generate_strong_password(length=12):
    if length < 12:
        raise ValueError("Password length should be at least 12 characters for better security.")

    # Define the character sets
    lowercase = string.ascii_lowercase
    uppercase = string.ascii_uppercase
    digits = string.digits
    special_characters = string.punctuation

    # Ensure the password includes at least one character from each set
    password = [
        random.choice(lowercase),
        random.choice(uppercase),
        random.choice(digits),
        random.choice(special_characters)
    ]

    # Fill the rest of the password length with random choices from all sets combined
    all_characters = lowercase + uppercase + digits + special_characters
    password += random.choices(all_characters, k=length - 4)

    # Shuffle the list to make the character order unpredictable
    random.shuffle(password)

    # Join the list into a string to form the final password
    return ''.join(password)

# Generate and print a strong password
print("Generated Strong Password:", generate_strong_password(16))
