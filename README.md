# DANCESYNC
DanceSync AI is a web-based computer vision application designed to help dancers perfect their moves by comparing their performance against a professional reference in real-time.

# Basic Details
Team Name: VibeKode
Team Members
Member 1: Parvana S Nair - Muthoot Institute of Technology and Science
Member 2: Angel Gylson - Muthoot Institute of Technology and Science

# Hosted Project Link
https://diyaparu.github.io/DANCESYNC/

# Project Description
DanceSync AI is a professional-grade motion analysis platform designed for dancers who want to bridge the gap between "practicing" and "perfecting." By leveraging MediaPipe Pose and Google Gemini AI, the application provides a high-fidelity comparison between a user's performance and a professional reference video. It doesn't just show you what you're doing; it mathematically dissects your form, timing, and synchronization to ensure every move is stage-ready.

# The Problem Statement
The hardest part of learning dance from a screen is the lack of real-time feedback. Most dancers record themselves, watch it back, and think, "Something looks off," but they can't pinpoint exactly what. Without a mirror or a coach present 24/7, bad habits go uncorrected, and synchronization remains a guessing game.

# The Solution
Your AI Dance Coach with No Filter. DanceSync AI acts as a digital mirror that actually talks back. It uses computer vision to track your skeleton in real-time and, once you're done, it roasts your lack of coordination. It points out exactly where you were lazy—whether your arms were lagging, your knees weren't bent enough, or you were off-beat—and stops you from practicing it wrong.

# Technical Details
Technologies/Components Used
For Software:
Core Engine: HTML, CSS, JavaScript (Web Interface)
Computer Vision: MediaPipe Pose (for 33-point body landmark tracking)
Intelligence: Google Gemini AI (to analyze score data and generate "unfiltered" coaching feedback)
Data Visualization: Matplotlib (for performance graph overlays)
Version Control: GitHub

# Features
1. Dual-Stream Pose Estimation
2. Angular Precision Scoring
3. Dynamic Sync HUD (Heads-Up Display)
4. Post-Performance "Pro Tips" Report

# Implementation For Software:
The implementation is divided into four critical phases:
1. Motion Capture: Utilizing MediaPipe to extract X, Y, and Z coordinates for key joints during video playback.
2. Angle Synthesis: Calculating the Euclidean distance and joint angles (A, B, C) to determine the mathematical "Sync Score."
3. The Critique Engine: The final score and movement data are sent to Google Gemini AI, which translates cold numbers into "tough love" feedback.
4. HUD Rendering: A sleek, neon-themed dashboard displays the live video, skeleton overlay, and the final post-dance roast report.

# Project Documentation
<img width="1918" height="1016" alt="Screenshot 2026-02-21 073537" src="https://github.com/user-attachments/assets/15969e60-39f3-4630-a8dc-a91546462c7a" />
<img width="1919" height="1016" alt="Screenshot 2026-02-21 073607" src="https://github.com/user-attachments/assets/1adf1b2d-1783-49bc-8c74-8733d72f3ee3" />
<img width="1918" height="1016" alt="Screenshot 2026-02-21 073630" src="https://github.com/user-attachments/assets/9b45afe9-b26d-43fa-9e99-133c7906386b" />
<img width="1919" height="1018" alt="Screenshot 2026-02-21 073737" src="https://github.com/user-attachments/assets/084c4a1f-b1e2-4109-b840-8590343bb183" />
<img width="1919" height="1018" alt="Screenshot 2026-02-21 073447" src="https://github.com/user-attachments/assets/90b57efc-eab0-4c3d-9c45-c40ac13e33c3" />








