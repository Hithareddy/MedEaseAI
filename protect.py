import re

def mask_numerics(text: str):
    nums = re.findall(r"\d[\d\.,:/-]*", text)
    mapping = {}
    masked = text

    for i, num in enumerate(nums):
        key = f"[NUM_{i}]"
        mapping[key] = num
        masked = masked.replace(num, key, 1)

    return masked, mapping

def restore_placeholders(text: str, mapping: dict):
    for key, value in mapping.items():
        text = text.replace(key, value)
    return text

def numerics_unchanged(original: str, new: str) -> bool:
    orig = re.findall(r"\d[\d\.,:/-]*", original)
    newn = re.findall(r"\d[\d\.,:/-]*", new)
    return orig == newn
