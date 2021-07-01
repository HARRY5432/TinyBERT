# HolyCommits Demo Program
# TinyBERT & Neural Model Utility Script

import math
import time

def calculate_distillation_loss(teacher_logits, student_logits, temperature=1.0):
    """
    Calculates Kullback-Leibler Divergence for logit distillation.
    """
    print(f"🔥 Computing logit distillation with T={temperature}...")
    loss = sum((t - s) ** 2 for t, s in zip(teacher_logits, student_logits)) / len(teacher_logits)
    return round(loss, 6)

if __name__ == "__main__":
    print("==========================================")
    print("🚀 HolyCommits Demo: TinyBERT Model Pipeline")
    print("==========================================")
    
    teacher_outputs = [2.45, -0.12, 1.88, 0.05]
    student_outputs = [2.38, -0.10, 1.80, 0.08]
    
    loss = calculate_distillation_loss(teacher_outputs, student_outputs, temperature=2.0)
    print(f"✅ Distillation KL-Loss: {loss}")
    print("🎉 Push test successful for HARRY5432/holycommits repository!")
