"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { useAuthStore } from "@/stores/authStore";
import {
  Upload,
  FileText,
  CheckCircle,
  Clock,
  ChevronDown,
} from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { uploadViaAPI } from "@/lib/apiUpload";
import toast from "react-hot-toast";
import { db } from "@/lib/firebase";

const KARNATAKA_UNIVERSITIES = [
  "A J Institute of Engineering, Dakshin Kannad",
  "Acharya Institute of Technology, Bengaluru",
  "Acharyar NRV School of Architecture, Bengaluru",
  "Adichunchanagiri Institute of Technology, Chikkamagaluru",
  "Aditya Academy of Architecture, Bengaluru",
  "Alvas Institute of Engineering, Dakshin Kannad",
  "AMG Rural College of Engineering, Dharwad",
  "Amruta Institute of Engineering, Bidadi, Bengaluru",
  "ANJUMAN Institute of Technology, Uttar Kannad",
  "APS College of Engineering, Bengaluru",
  "Appa Institute of Engineering & Technology, Kalaburagi",
  "B G S Institute of Technology, Mandya",
  "B M S (Even) College of Engineering, Bengaluru",
  "B M S College of Engineering, Bengaluru",
  "B M S College of Architecture, Bengaluru",
  "B N M Institute of Technology, Bengaluru",
  "B T L Institute of Technology Management, Bengaluru",
  "Bapuji Institute of Engineering, Davangere",
  "Basava Kalyan Engineering College, Bidar",
  "Basaveshwar Engineering College, Bagalkot",
  "BASAV Engineering School of, Vijayapura",
  "Bearys Institute of Technology, Dakshin Kannad",
  "Biluru Gurubasava Mahaswamiji Institute of Technology,Mudhol, Bagalkot",
  "BMS School of Architecture, Bengaluru",
  "Brindavan College of Engg., Bengaluru Urban",
  "C M R Institute of Technology, Bengaluru",
  "Cauvery Institute of Technology, Mandya",
  "Cambridge Institute of Technology, Bengaluru",
  "Canara Engineering College, Dakshin Kannad",
  "Channabasaveshwara Institute, Tumakuru",
  "City Engineering College, Bengaluru",
  "Dayananda Sagar College of, Bengaluru Urban",
  "Dayananda Sagar College of Architecture, Bengaluru",
  "Don Bosco Institute of Technology, Bengaluru",
  "East Point College of Engg., Bengaluru",
  "East West Institute of Technology, Bengaluru",
  "East West School of Architecture, Bengaluru",
  "East West College of Engineering, Bengaluru",
  "Ekalavya Institute of Technology, Chamarajanagar",
  "G M Institute of Technology, Davangere",
  "G Madegowda Institute of, Mandya",
  "G S S S Institute of Engineering, Mysuru",
  "Gogte Institute of Technology, Belagavi",
  "Gopalan College of Engineering, Bengaluru",
  "Gopalan School of Architecture, Bengaluru",
  "Govind B. P. Institute of Technology, Bidar",
  "Government Engineering College, Ballari",
  "Government Engineering College, Chamarajanagar",
  "Government Engineering College, Dakshin Kannad",
  "Government Engineering College, Hassan",
  "Government Engineering College, Haveri",
  "Government Engineering College, Koppal",
  "Govt. S K S J Technological Institute, Bengaluru",
  "Govt. Tool Room & Training, Bengaluru",
  "H K B K College of Engineering, Bengaluru",
  "H M S Institute of Technology, Tumkur",
  "HMS School of Architecture, Tumakuru",
  "Hirasugar Institute of Technology, Belagavi",
  "Honeywell Technologies Solutions, Bengaluru",
  "Impact College of Engineering, Bengaluru",
  "Impact School of Architecture, Bengaluru",
  "Islamiah Inst. of Technology, Bengaluru",
  "J N N College of Engineering, Shivamogga",
  "Jain Acharya Gundharnandi Maharaj, Bagalkot",
  "Jain College of Engineering, Belagavi",
  "Jain College of Engineering, Dharwad",
  "Jain Institute of Technology, Davangere",
  "JAIN COLLEGE OF ENGINEERING, Belagavi",
  "JAIN COLLEGE OF ENGINEERING, Dharwad",
  "Jnana Vikas Institute of Technology, Bengaluru",
  "J S S Academy of Technical Education, Bengaluru",
  "J S C Institute of Technology, Chickballapur",
  "Jyothy Institute of Technology, Bengaluru",
  "K L Es College of Engg. & Technology, Belagavi",
  "K N S Institute of Technology, Bengaluru",
  "K S Institute of Technology, Bengaluru",
  "K S School of Architecture, Bengaluru",
  "K S School of Engineering & Management, Bengaluru",
  "K T C Engineering College, Kalaburagi",
  "Kalpataru Institute of Technology, Tumakuru",
  "Karavali Institute of Technology, Dakshin Kannad",
  "KLE Institute of Technology, Hubli",
  "KLEs College of Engineering & Technology, Belagavi",
  "K V G College of Engineering, Dakshin Kannad",
  "Lingaraj Appa Engineering, Bidar",
  "M S Engineering College, Bengaluru",
  "M S Ramaiah Institute of Technology, Bengaluru",
  "Malnad College of Engineering, Hassan",
  "Malik Sandal Institute of Arts & Architecture, Vijayapura",
  "Maharaja Institute of Technology, Mysuru",
  "Mangalore Institute of Technology, Dakshin Kannad",
  "Mangalore Marine College and, Dakshin Kannad",
  "Maratha Mandal Engineering, Belagavi",
  "Moodalkatte Institute of Technology, Udupi",
  "Mysore College of Engineering, Mysuru",
  "Mysore School of Architecture, Mysuru",
  "Mysuru Royal Institute of, Mandya",
  "Nagarjuna College of Engg., Bengaluru",
  "NDRK Institute of Technology, Hassan",
  "NE Institute of Engineering, Mysuru",
  "Nitte Meenakshi Institute of, Bengaluru",
  "Nitte School of Architecture, Bengaluru",
  "NMAM Institute of Technology, Udupi",
  "P A College of Engineering, Mangalore",
  "PDA College of Engineering, Kalaburagi",
  "PES College of Engineering, Mandya",
  "PES Institute of Technology, Shivamogga",
  "Proudadevaraya Institute of Technology, Ballari",
  "Rajeev Institute of Technology, Hassan",
  "Rajarajeshwari College of Engineering, Bengaluru",
  "Rajiv Gandhi Institute of Technology, Bengaluru",
  "Rao Bahaddur Y Mahabaleshwa, Ballari",
  "R L Jalappa Institute of Technology, Chikballapur",
  "R N S Institute of Technology, Bengaluru",
  "R T Nagar Post, Bengaluru",
  "RD Institute of Technology, Bengaluru",
  "RNS School of Architecture, Bengaluru",
  "R V College of Architecture, Bengaluru",
  "R V College of Engineering, Bengaluru",
  "S J M Institute of Technology, Chitradurga",
  "S J B Institute of Technology, Bengaluru",
  "S J C Institute of Technology, Chickballapur",
  "S J S Academy of Technical Education, Bengaluru",
  "SJB School of Architecture, Bengaluru",
  "S G Balekundri Institute of Technology, Belagavi",
  "S K S J Technological Institute (Eve), Bengaluru",
  "S L N College of Raichur",
  "S M V School of Architecture, Bengaluru",
  "Sakshiganga College of Engineering, Mysuru",
  "Sahyadri College of Engineering, Dakshin Kannad",
  "Sampoorna Institute of Technology, Ramanagara",
  "Sapthagiri College of Engineering, Bengaluru",
  "Sathyabama Institute of Science and Technology",
  "Shaikh College of Engineering & Technology, Belagavi",
  "Shridevi Institute of Engineering, Tumakuru",
  "Shri Madhwa Vadiraja Institute of, Udupi",
  "Shree Devi Institute of Technology, Dakshin Kannad",
  "Shree Vinayaka Institute of, Kolar",
  "Shushrutha Institute of Medical Sciences and Research Centre",
  "Smt. Kamala & Sri Venkappa M Agadi, Gadag",
  "Srinivas Institute of Technology, Dakshin Kannad",
  "Sri Basaveshwara Institute of, Tumakuru",
  "Sri Krishana Institute of Technology, Bengaluru",
  "Sri Sairam College of Engineering, Bengaluru",
  "ST J Institute of Technology, Ranebennur",
  "St Joseph Engineering College, Dakshin Kannad",
  "Tontadarya College of Engineering, Gadag",
  "VTU Extension Centre, Bengaluru",
  "VTU Extension Centre, IR Rasta, Bengaluru",
  "VTU Extension Center, N M A Dakshin Kannad",
  "Vemana Institute of Technology, Bengaluru",
  "Veerappa Nisty Engineering, Kalaburagi",
  "Vijaya Vittal Institute of Technology, Bengaluru",
  "Vidya Vikas Institute of Technology, Mysuru",
  "Vishwanathrao Deshpande Institute of, Uttar Kannad",
  "Visvesvaraya Technological University, Belagavi",
  "Visvesvaraya Technological University, Chikballapur",
  "Visvesvaraya Technological University, Kalaburagi",
  "Vivekananda College of Engineering & Tech., Dakshin Kannad",
  "Vivekananda Institute of Technology, Bengaluru Rural",
  "Wadiyar Centre for Architecture, Mysuru",
  "Yenepoya Institute of Technology, Dakshin Kannad",
  "Zain University, Karnataka",
];


const SEMESTERS = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
];

// Branch and subject mapping for each semester
const SEMESTER_BRANCHES = {
  "1st Semester": [
    "Computer Science & Engineering",
    "Electronics & Communication Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical and Electronics Engineering",
    "Information Science Engineering",
    "Artificial Intelligence and Data Science",
    "Artificial Intelligence & Machine Learning",
  ],
  "2nd Semester": [
    "Computer Science & Engineering",
    "Electronics & Communication Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical and Electronics Engineering",
    "Information Science Engineering",
    "Artificial Intelligence and Data Science",
    "Artificial Intelligence & Machine Learning",
  ],
  "3rd Semester": [
    "Computer Science & Engineering",
    "Electronics & Communication Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical and Electronics Engineering",
    "Information Science Engineering",
    "Artificial Intelligence and Data Science",
    "Artificial Intelligence & Machine Learning",
  ],
  "4th Semester": [
    "Computer Science & Engineering",
    "Electronics & Communication Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical and Electronics Engineering",
    "Information Science Engineering",
    "Artificial Intelligence and Data Science",
    "Artificial Intelligence & Machine Learning",
  ],
  "5th Semester": [
    "Computer Science & Engineering",
    "Electronics & Communication Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical and Electronics Engineering",
    "Information Science Engineering",
    "Artificial Intelligence and Data Science",
    "Artificial Intelligence & Machine Learning",
  ],
  "6th Semester": [
    "Computer Science & Engineering",
    "Electronics & Communication Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical and Electronics Engineering",
    "Information Science Engineering",
    "Artificial Intelligence and Data Science",
    "Artificial Intelligence & Machine Learning",
  ],
  "7th Semester": [
    "Computer Science & Engineering",
    "Electronics & Communication Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical and Electronics Engineering",
    "Information Science Engineering",
    "Artificial Intelligence and Data Science",
    "Artificial Intelligence & Machine Learning",
  ],
  "8th Semester": [
    "Computer Science & Engineering",
    "Electronics & Communication Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical and Electronics Engineering",
    "Information Science Engineering",
    "Artificial Intelligence and Data Science",
    "Artificial Intelligence & Machine Learning",
  ],
};

// Subject mapping for each branch by semester
const BRANCH_SUBJECTS = {
  "Computer Science & Engineering": {
    "1st Semester": [
      "BMATX102-202 - Engineering Mathematics-I or Engineering Mathematics-II",
      "BCEDK103-203 - Computer-Aided Engineering Drawing",
      "BCHES102-202 - Applied Chemistry for CSE Stream",
      "BENGK106-206 - Communicative English",
      "BESCK104A-204A - Introduction to Civil Engineering",
      "BESCK104B-204B - Introduction to Electrical Engineering",
      "BESCK104C-204C - Introduction to Electronics Communication",
      "BESCK104D-204D - Introduction to Mechanical Engineering",
      "BESCK104E-204E - Introduction to C Programming",
      "BETCK105A-205A - Smart Materials and Systems",
      "BETCK105B-205B - Green Buildings",
      "BETCK105C-205C - Introduction to Nano Technology",
      "BETCK105D-205D - Introduction to Sustainable Engineering",
      "BETCK105E-205E - Renewable Energy Sources",
      "BETCK105F-205F - Waste Management",
      "BETCK105G-205G - Emerging Applications of Biosensors",
      "BETCK105H-205H - Introduction to Internet of Things (IOT)",
      "BETCK105I-205I - Introduction to Cyber Security",
      "BETCK105J-205J - Introduction to Embedded System",
      "BICOK107-207 - Indian Constitution",
      "BIDTK158-258 - Innovation and Design Thinking",
      "BKBKK107-207 - Balake Kannada",
      "BKSKK107-207 - Samskrutika Kannada",
      "BMATS101 - Mathematics-I for CSE Stream",
      "BPHYS102-202 - Applied Physics for CSE stream",
      "BPLCK105A-205A - Introduction to Web Programming",
      "BPLCK105B-205B - Introduction to Python Programming",
      "BPLCK105C-205C - Basics of JAVA programming",
      "BPLCK105D-205D - Introduction to C++ Programming",
      "BPOPS103-203 - Principles of Programming Using C",
      "BPWSK106-206 - Professional Writing Skills in English",
      "BSFHK158-258 - Scientific Foundations of Health",
    ],
    "2nd Semester": [
      "BMATX102-202 - Engineering Mathematics-I or Engineering Mathematics-II",
      "BCEDK103-203 - Computer-Aided Engineering Drawing",
      "BCHES102-202 - Applied Chemistry for CSE Stream",
      "BENGK106-206 - Communicative English",
      "BESCK104A-204A - Introduction to Civil Engineering",
      "BESCK104B-204B - Introduction to Electrical Engineering",
      "BESCK104C-204C - Introduction to Electronics Communication",
      "BESCK104D-204D - Introduction to Mechanical Engineering",
      "BESCK104E-204E - Introduction to C Programming",
      "BETCK105A-205A - Smart Materials and Systems",
      "BETCK105B-205B - Green Buildings",
      "BETCK105C-205C - Introduction to Nano Technology",
      "BETCK105D-205D - Introduction to Sustainable Engineering",
      "BETCK105E-205E - Renewable Energy Sources",
      "BETCK105F-205F - Waste Management",
      "BETCK105G-205G - Emerging Applications of Biosensors",
      "BETCK105H-205H - Introduction to Internet of Things (IOT)",
      "BETCK105I-205I - Introduction to Cyber Security",
      "BETCK105J-205J - Introduction to Embedded System",
      "BICOK107-207 - Indian Constitution",
      "BIDTK158-258 - Innovation and Design Thinking",
      "BKBKK107-207 - Balake Kannada",
      "BKSKK107-207 - Samskrutika Kannada",
      "BMATS101 - Mathematics-I for CSE Stream",
      "BPHYS102-202 - Applied Physics for CSE stream",
      "BPLCK105A-205A - Introduction to Web Programming",
      "BPLCK105B-205B - Introduction to Python Programming",
      "BPLCK105C-205C - Basics of JAVA programming",
      "BPLCK105D-205D - Introduction to C++ Programming",
      "BPOPS103-203 - Principles of Programming Using C",
      "BPWSK106-206 - Professional Writing Skills in English",
      "BSFHK158-258 - Scientific Foundations of Health",
    ],
    "3rd Semester": [
      "BCS301 - Mathematics for Computer Science",
      "BCS302 - Digital Design & Computer Organization",
      "BCS303 - Operating Systems",
      "BCS304 - Data Structures and Applications",
      "BCS306A - Object Oriented Programming with Java",
      "BCS306B - Object Oriented Programming with C++",
      "BCS358A - Data analytics with Excel",
      "BCS358B - R Programming",
      "BCS358C - Project Management with Git",
      "BCS358D - Data Visualization with Python",
      "BCSL305 - Data Structures Lab",
      "BSCK307 - Social Connect and Responsibility",
    ],
    "4th Semester": [
      "BBOC407 - Biology For Computer Engineers",
      "BCS401 - Analysis & Design of Algorithms",
      "BCS402 - Microcontrollers",
      "BCS403 - Database Management Systems",
      "BCS405A - Discrete Mathematical Structures",
      "BCS405B - Graph Theory",
      "BCS405C - Optimization Technique",
      "BCS405D - Linear Algebra",
      "BCS456A - Green IT and Sustainability",
      "BCS456B - Capacity Planning for IT",
      "BCS456C - UI/UX",
      "BCSL404 - Analysis & Design of Algorithms Lab",
      "BCSL456D - Technical writing using LATEX",
      "BUHK408 - Universal human values course",
    ],
    "5th Semester": [
      "BCS501 - Software Engineering & Project Management",
      "BCS502 - Computer Networks",
      "BCS503 - Theory of Computation",
      "BCS508 - Environmental Studies and E-waste Management",
      "BCS515A - Computer Graphics",
      "BCS515B - Artificial Intelligence",
      "BCS515C - Unix System Programming",
      "BCS515D - Distributed Systems",
      "BCSL504 - Web Technology Lab",
      "BRMK557 - Research Methodology and IPR",
    ],
    "6th Semester": [
      "BCS601 - Cloud Computing",
      "BCS602 - Machine Learning",
      "BCS613A - Blockchain Technology",
      "BCS613B - Computer Vision",
      "BCS613C - Compiler Design",
      "BCS613D - Advanced Java",
      "BCS654A - Introduction to Data Structures",
      "BCS654B - Fundamentals of Operating Systems",
      "BCSL606 - Machine Learning lab",
      "BCSL657B - React",
      "BCSL657D - Devops",
      "BIS654C - Mobile Application Development",
      "BISL657A - Tosca - Automated Software testing",
    ],
    "7th Semester": [
      "BAD714D - Social Network Analysis",
      "BCS701 - Internet of Things",
      "BCS702 - Parallel Computing",
      "BCS703 - Cryptography & Network Security",
      "BCS714A - Deep Learning",
      "BCS714B - Natural Language Processing",
      "BCS714D - Big Data Analytics",
      "BCS755A - Introduction to DBMS",
      "BCS755B - Introduction to Algorithms",
      "BCS755C - Software Engineering",
    ],
    "8th Semester": [
      "Blockchain Technology",
      "Advanced Machine Learning",
      "Natural Language Processing",
      "Computer Vision",
      "Internship",
      "Project Work-II",
    ],
  },
  "Electronics & Communication Engineering": {
    "1st Semester": [
      "BMATX102-202 - Engineering Mathematics-I or Engineering Mathematics-II",
      "BCEDK103-203 - Computer-Aided Engineering Drawing",
      "BCHES102-202 - Applied Chemistry for CSE Stream",
      "BENGK106-206 - Communicative English",
      "BESCK104A-204A - Introduction to Civil Engineering",
      "BESCK104B-204B - Introduction to Electrical Engineering",
      "BESCK104C-204C - Introduction to Electronics Communication",
      "BESCK104D-204D - Introduction to Mechanical Engineering",
      "BESCK104E-204E - Introduction to C Programming",
      "BETCK105A-205A - Smart Materials and Systems",
      "BETCK105B-205B - Green Buildings",
      "BETCK105C-205C - Introduction to Nano Technology",
      "BETCK105D-205D - Introduction to Sustainable Engineering",
      "BETCK105E-205E - Renewable Energy Sources",
      "BETCK105F-205F - Waste Management",
      "BETCK105G-205G - Emerging Applications of Biosensors",
      "BETCK105H-205H - Introduction to Internet of Things (IOT)",
      "BETCK105I-205I - Introduction to Cyber Security",
      "BETCK105J-205J - Introduction to Embedded System",
      "BICOK107-207 - Indian Constitution",
      "BIDTK158-258 - Innovation and Design Thinking",
      "BKBKK107-207 - Balake Kannada",
      "BKSKK107-207 - Samskrutika Kannada",
      "BMATS101 - Mathematics-I for CSE Stream",
      "BPHYS102-202 - Applied Physics for CSE stream",
      "BPLCK105A-205A - Introduction to Web Programming",
      "BPLCK105B-205B - Introduction to Python Programming",
      "BPLCK105C-205C - Basics of JAVA programming",
      "BPLCK105D-205D - Introduction to C++ Programming",
      "BPOPS103-203 - Principles of Programming Using C",
      "BPWSK106-206 - Professional Writing Skills in English",
      "BSFHK158-258 - Scientific Foundations of Health",
    ],
    "2nd Semester": [
      "BMATX102-202 - Engineering Mathematics-I or Engineering Mathematics-II",
      "BCEDK103-203 - Computer-Aided Engineering Drawing",
      "BCHES102-202 - Applied Chemistry for CSE Stream",
      "BENGK106-206 - Communicative English",
      "BESCK104A-204A - Introduction to Civil Engineering",
      "BESCK104B-204B - Introduction to Electrical Engineering",
      "BESCK104C-204C - Introduction to Electronics Communication",
      "BESCK104D-204D - Introduction to Mechanical Engineering",
      "BESCK104E-204E - Introduction to C Programming",
      "BETCK105A-205A - Smart Materials and Systems",
      "BETCK105B-205B - Green Buildings",
      "BETCK105C-205C - Introduction to Nano Technology",
      "BETCK105D-205D - Introduction to Sustainable Engineering",
      "BETCK105E-205E - Renewable Energy Sources",
      "BETCK105F-205F - Waste Management",
      "BETCK105G-205G - Emerging Applications of Biosensors",
      "BETCK105H-205H - Introduction to Internet of Things (IOT)",
      "BETCK105I-205I - Introduction to Cyber Security",
      "BETCK105J-205J - Introduction to Embedded System",
      "BICOK107-207 - Indian Constitution",
      "BIDTK158-258 - Innovation and Design Thinking",
      "BKBKK107-207 - Balake Kannada",
      "BKSKK107-207 - Samskrutika Kannada",
      "BMATS101 - Mathematics-I for CSE Stream",
      "BPHYS102-202 - Applied Physics for CSE stream",
      "BPLCK105A-205A - Introduction to Web Programming",
      "BPLCK105B-205B - Introduction to Python Programming",
      "BPLCK105C-205C - Basics of JAVA programming",
      "BPLCK105D-205D - Introduction to C++ Programming",
      "BPOPS103-203 - Principles of Programming Using C",
      "BPWSK106-206 - Professional Writing Skills in English",
      "BSFHK158-258 - Scientific Foundations of Health",
    ],
    "3rd Semester": [
      "BEC302 - Digital System Design using Verilog",
      "BEC303 - Electronic Principles and Circuits",
      "BEC304 - Network Analysis",
      "BEC306A - Electronic Devices",
      "BEC306B - Sensors and Instrumentation",
      "BEC306C - Computer Organization and Architecture",
      "BEC306D - Applied Numerical Methods for EC Engineers",
      "BEC358A - LABVIEW programming",
      "BEC358B - MATLAB Programming",
      "BEC358C - C++ Basics",
      "BEC358D - IOT for Smart Infrastructure",
      "BECL305 - Analog and Digital Systems Design Lab",
      "BMATEC301 - AV Mathematics-III for EC Engineering",
      "BSCK307 - Social Connect and Responsibility",
    ],
    "4th Semester": [
      "BBOK407 - Biology For Engineers",
      "BEC401 - Electromagnetics Theory",
      "BEC402 - Principles of Communication Systems",
      "BEC403 - Control Systems",
      "BEC405A - Microcontrollers",
      "BEC405B - Industrial Electronics",
      "BEC405C - Operating Systems",
      "BEC405D - Data Structures using C",
      "BECL404 - Communication Lab",
      "BECL456A - Microcontroller Lab",
      "BECL456B - Programmable Logic Controllers",
      "BECL456C - Octave Programming",
      "BECL456D - Data Structures Lab using C",
      "BUHK408 - Universal human values course",
    ],
    "5th Semester": [
      "BEC501 - Technological Innovation and Management Entrepreneurship",
      "BEC502 - Digital Signal Processing",
      "BEC503 - Digital Communication",
      "BEC515A - Intelligent Systems and Machine Learning Algorithms",
      "BEC515B - Digital Switching and Finite Automata Theory",
      "BEC515C - Data Structure using C++",
      "BEC515D - Satellite and Optical Communication",
      "BECL504 - Digital Communication Lab",
      "BESK508 - Environmental Studies",
      "BRMK557 - Research Methodology and IPR",
    ],
    "6th Semester": [
      "BEC601 - Embedded System Design",
      "BEC602 - VLSI Design and Testing",
      "BEC613A - Multimedia Communication",
      "BEC613B - Data Security",
      "BEC613C - Digital Image Processing",
      "BEC613D - FPGA Based System design Using Verilog",
      "BEC654A - Digital System Design using Verilog",
      "BEC654B - Consumer Electronics",
      "BEC654C - Electronics Communication System",
      "BEC654D - Basic VLSI Design",
      "BEC657A - FPGA system design Lab using Verilog",
      "BEC657B - System Modeling using Simulink",
      "BEC657C - IoT Laboratory",
      "BEC657D - Python Programing for Machine Learning Applications",
      "BECL606 - VLSI Design and Testing Lab",
    ],
    "7th Semester": [
      "BEC701 - Microwave Engineering and Antenna Theory",
      "BEC702 - Computer Networks and Protocols",
      "BEC703 - Wireless Communication Systems",
      "BEC714A - Application Specific Integrated Circuit",
      "BEC714B - Computer and Network Security",
      "BEC714C - Automative Electronics",
      "BEC714D - Radar Communication",
      "BEC755A - E-waste Management",
      "BEC755B - Automative Engineering",
      "BEC755D - Sensors and Actuators",
      "BTE755C - Embedded System Applications",
    ],
    "8th Semester": [
      "Artificial Intelligence",
      "Robotics",
      "Smart Systems",
      "Advanced VLSI",
      "Internship",
      "Project Work-II",
    ],
  },
  "Mechanical Engineering": {
    "1st Semester": [
      "BMATX102-202 - Engineering Mathematics-I or Engineering Mathematics-II",
      "BCEDK103-203 - Computer-Aided Engineering Drawing",
      "BCHES102-202 - Applied Chemistry for CSE Stream",
      "BENGK106-206 - Communicative English",
      "BESCK104A-204A - Introduction to Civil Engineering",
      "BESCK104B-204B - Introduction to Electrical Engineering",
      "BESCK104C-204C - Introduction to Electronics Communication",
      "BESCK104D-204D - Introduction to Mechanical Engineering",
      "BESCK104E-204E - Introduction to C Programming",
      "BETCK105A-205A - Smart Materials and Systems",
      "BETCK105B-205B - Green Buildings",
      "BETCK105C-205C - Introduction to Nano Technology",
      "BETCK105D-205D - Introduction to Sustainable Engineering",
      "BETCK105E-205E - Renewable Energy Sources",
      "BETCK105F-205F - Waste Management",
      "BETCK105G-205G - Emerging Applications of Biosensors",
      "BETCK105H-205H - Introduction to Internet of Things (IOT)",
      "BETCK105I-205I - Introduction to Cyber Security",
      "BETCK105J-205J - Introduction to Embedded System",
      "BICOK107-207 - Indian Constitution",
      "BIDTK158-258 - Innovation and Design Thinking",
      "BKBKK107-207 - Balake Kannada",
      "BKSKK107-207 - Samskrutika Kannada",
      "BMATS101 - Mathematics-I for CSE Stream",
      "BPHYS102-202 - Applied Physics for CSE stream",
      "BPLCK105A-205A - Introduction to Web Programming",
      "BPLCK105B-205B - Introduction to Python Programming",
      "BPLCK105C-205C - Basics of JAVA programming",
      "BPLCK105D-205D - Introduction to C++ Programming",
      "BPOPS103-203 - Principles of Programming Using C",
      "BPWSK106-206 - Professional Writing Skills in English",
      "BSFHK158-258 - Scientific Foundations of Health",
    ],
    "2nd Semester": [
      "BMATX102-202 - Engineering Mathematics-I or Engineering Mathematics-II",
      "BCEDK103-203 - Computer-Aided Engineering Drawing",
      "BCHES102-202 - Applied Chemistry for CSE Stream",
      "BENGK106-206 - Communicative English",
      "BESCK104A-204A - Introduction to Civil Engineering",
      "BESCK104B-204B - Introduction to Electrical Engineering",
      "BESCK104C-204C - Introduction to Electronics Communication",
      "BESCK104D-204D - Introduction to Mechanical Engineering",
      "BESCK104E-204E - Introduction to C Programming",
      "BETCK105A-205A - Smart Materials and Systems",
      "BETCK105B-205B - Green Buildings",
      "BETCK105C-205C - Introduction to Nano Technology",
      "BETCK105D-205D - Introduction to Sustainable Engineering",
      "BETCK105E-205E - Renewable Energy Sources",
      "BETCK105F-205F - Waste Management",
      "BETCK105G-205G - Emerging Applications of Biosensors",
      "BETCK105H-205H - Introduction to Internet of Things (IOT)",
      "BETCK105I-205I - Introduction to Cyber Security",
      "BETCK105J-205J - Introduction to Embedded System",
      "BICOK107-207 - Indian Constitution",
      "BIDTK158-258 - Innovation and Design Thinking",
      "BKBKK107-207 - Balake Kannada",
      "BKSKK107-207 - Samskrutika Kannada",
      "BMATS101 - Mathematics-I for CSE Stream",
      "BPHYS102-202 - Applied Physics for CSE stream",
      "BPLCK105A-205A - Introduction to Web Programming",
      "BPLCK105B-205B - Introduction to Python Programming",
      "BPLCK105C-205C - Basics of JAVA programming",
      "BPLCK105D-205D - Introduction to C++ Programming",
      "BPOPS103-203 - Principles of Programming Using C",
      "BPWSK106-206 - Professional Writing Skills in English",
      "BSFHK158-258 - Scientific Foundations of Health",
    ],
    "3rd Semester": [
      "BME301 - Mechanics of Materials",
      "BME302 - Manufacturing Process",
      "BME303 - Material Science and Engineering",
      "BME304 - Basic Thermodynamics",
      "BME306A - Electric and Hybrid Vehicle Technology",
      "BME306B - Smart Materials & Systems",
      "BME306C - Internet of Things (IoT)",
      "BME306D - Waste handling and Management",
      "BME358A - Advanced Python Programming",
      "BME358B - Fundamentals of Virtual Reality",
      "BME358C - Spreadsheet for Engineers",
      "BME358D - Tools in Scientific Computing",
      "BMEL305 - Introduction to Modelling and Design for Manufacturing",
      "BSCK307 - Social Connect and Responsibility",
    ],
    "4th Semester": [
      "BBOK407 - Biology For Engineers",
      "BME401 - Applied Thermodynamics",
      "BME402 - Machining Science & Metrology",
      "BME403 - Fluid Mechanics",
      "BME404 - Mechanical Measurements and Metrology lab",
      "BME405A - Non Traditional Machining",
      "BME405B - Environmental Studies",
      "BME405C - Micro Electro Mechanical Systems",
      "BME405D - Robotics and Automation",
      "BME456A - Introduction to AI & ML",
      "BME456B - Digital Marketing",
      "BME456C - Introduction to Data Analytics",
      "BME456D - Introduction to Programming in C++",
      "BUHK408 - Universal human values course",
    ],
    "5th Semester": [
      "BESK508 - Environmental Studies",
      "BME501 - Industrial Management & Entrepreneurship",
      "BME502 - Turbo machines",
      "BME503 - Theory of Machines",
      "BME504L - CNC Programming and 3-D Printing lab",
      "BME515A - Mechatronics",
      "BME515B - Automation in manufacturing",
      "BME515C - Supply chain management & Introduction to SAP",
      "BME515D - Energy Engineering",
      "BRMK557 - Research Methodology and IPR",
    ],
    "6th Semester": [
      "BME601 - Heat Transfer",
      "BME602 - Machine Design",
      "BME613A - Total Quality Management",
      "BME613B - Refrigeration and Air Conditioning",
      "BME613C - MEMS and Microsystem Technology",
      "BME613D - Design for Manufacturing and Assembly",
      "BME654A - Project Management",
      "BME654B - Renewable Energy Power plants",
      "BME654C - Introduction to Mechatronics",
      "BME654D - Modern Mobility",
      "BME657A - Basics of Matlab",
      "BME657B - Fundamental of Virtual Reality ARP Development",
      "BME657C - Simulation and Analysis using Ansys workbench",
      "BME657D - Introduction Augmented Reality",
      "BMEL606L - Design lab",
    ],
    "7th Semester": [
      "BME701 - Finite Element Methods",
      "BME702 - Hydraulics and Pneumatics",
      "BME703 - Control Engineering",
      "BME714A - Additive manufacturing",
      "BME714B - Product Design and Management",
      "BME714C - IC Engines",
      "BME714D - Cryogenics",
      "BME755A - Introduction to Non-Traditional machining",
      "BME755B - Basics of Hydraulics and Pneumatics",
      "BME755C - Operations Research",
      "BME755D - Non-Conventional Energy Resources",
    ],
    "8th Semester": [
      "Advanced Robotics",
      "Smart Manufacturing",
      "Sustainable Engineering",
      "Design Optimization",
      "Internship",
      "Project Work-II",
    ],
  },
  "Civil Engineering": {
    "1st Semester": [
      "BMATX102-202 - Engineering Mathematics-I or Engineering Mathematics-II",
      "BCEDK103-203 - Computer-Aided Engineering Drawing",
      "BCHES102-202 - Applied Chemistry for CSE Stream",
      "BENGK106-206 - Communicative English",
      "BESCK104A-204A - Introduction to Civil Engineering",
      "BESCK104B-204B - Introduction to Electrical Engineering",
      "BESCK104C-204C - Introduction to Electronics Communication",
      "BESCK104D-204D - Introduction to Mechanical Engineering",
      "BESCK104E-204E - Introduction to C Programming",
      "BETCK105A-205A - Smart Materials and Systems",
      "BETCK105B-205B - Green Buildings",
      "BETCK105C-205C - Introduction to Nano Technology",
      "BETCK105D-205D - Introduction to Sustainable Engineering",
      "BETCK105E-205E - Renewable Energy Sources",
      "BETCK105F-205F - Waste Management",
      "BETCK105G-205G - Emerging Applications of Biosensors",
      "BETCK105H-205H - Introduction to Internet of Things (IOT)",
      "BETCK105I-205I - Introduction to Cyber Security",
      "BETCK105J-205J - Introduction to Embedded System",
      "BICOK107-207 - Indian Constitution",
      "BIDTK158-258 - Innovation and Design Thinking",
      "BKBKK107-207 - Balake Kannada",
      "BKSKK107-207 - Samskrutika Kannada",
      "BMATS101 - Mathematics-I for CSE Stream",
      "BPHYS102-202 - Applied Physics for CSE stream",
      "BPLCK105A-205A - Introduction to Web Programming",
      "BPLCK105B-205B - Introduction to Python Programming",
      "BPLCK105C-205C - Basics of JAVA programming",
      "BPLCK105D-205D - Introduction to C++ Programming",
      "BPOPS103-203 - Principles of Programming Using C",
      "BPWSK106-206 - Professional Writing Skills in English",
      "BSFHK158-258 - Scientific Foundations of Health",
    ],
    "2nd Semester": [
      "BMATX102-202 - Engineering Mathematics-I or Engineering Mathematics-II",
      "BCEDK103-203 - Computer-Aided Engineering Drawing",
      "BCHES102-202 - Applied Chemistry for CSE Stream",
      "BENGK106-206 - Communicative English",
      "BESCK104A-204A - Introduction to Civil Engineering",
      "BESCK104B-204B - Introduction to Electrical Engineering",
      "BESCK104C-204C - Introduction to Electronics Communication",
      "BESCK104D-204D - Introduction to Mechanical Engineering",
      "BESCK104E-204E - Introduction to C Programming",
      "BETCK105A-205A - Smart Materials and Systems",
      "BETCK105B-205B - Green Buildings",
      "BETCK105C-205C - Introduction to Nano Technology",
      "BETCK105D-205D - Introduction to Sustainable Engineering",
      "BETCK105E-205E - Renewable Energy Sources",
      "BETCK105F-205F - Waste Management",
      "BETCK105G-205G - Emerging Applications of Biosensors",
      "BETCK105H-205H - Introduction to Internet of Things (IOT)",
      "BETCK105I-205I - Introduction to Cyber Security",
      "BETCK105J-205J - Introduction to Embedded System",
      "BICOK107-207 - Indian Constitution",
      "BIDTK158-258 - Innovation and Design Thinking",
      "BKBKK107-207 - Balake Kannada",
      "BKSKK107-207 - Samskrutika Kannada",
      "BMATS101 - Mathematics-I for CSE Stream",
      "BPHYS102-202 - Applied Physics for CSE stream",
      "BPLCK105A-205A - Introduction to Web Programming",
      "BPLCK105B-205B - Introduction to Python Programming",
      "BPLCK105C-205C - Basics of JAVA programming",
      "BPLCK105D-205D - Introduction to C++ Programming",
      "BPOPS103-203 - Principles of Programming Using C",
      "BPWSK106-206 - Professional Writing Skills in English",
      "BSFHK158-258 - Scientific Foundations of Health",
    ],
    "3rd Semester": [
      "BCV301 - Strength of Materials",
      "BCV302 - Engineering Survey",
      "BCV303 - Engineering Geology",
      "BCV304 - Water Supply and Waste water Engineering",
      "BCV305 - Computer Aided Building Planning and Drawing",
      "BCV306A - Rural, Urban Planning and Architecture",
      "BCV306B - Geospatial Techniques in Practice",
      "BCV306C - Sustainable Design Concept for Building Services",
      "BCV306D - Fire Safety in Buildings",
      "BCV358A - Data analytics with Excel",
      "BCV358B - Smart Urban Infrastructure",
      "BCV358C - Problem Solving with Python",
      "BCV358D - Personality Development for Civil Engineers",
      "BSCK307 - Social Connect and Responsibility",
    ],
    "4th Semester": [
      "BBOK407 - Biology For Engineers",
      "BCV401 - Analysis of Structures",
      "BCV402 - Fluid Mechanics and Hydraulics",
      "BCV403 - Transportation Engineering",
      "BCV405A - Finance for Professionals",
      "BCV405B - Construction Equipment, Plants and Machinery",
      "BCV405C - Concreting Techniques & Practices",
      "BCV405D - Watershed Management",
      "BCV456B - GIS with Quantum GIS",
      "BCV456C - Electronic Waste Management - Issues and Challenges",
      "BCV456D - Technical Writing Skills",
      "BCVL404 - Building Materials Testing Lab",
      "BCVL456A - Building Information Modelling in Civil Engineering",
      "BUHK408 - Universal human values course",
    ],
    "5th Semester": [
      "BCV501 - Construction Management and Entrepreneurship",
      "BCV502 - Geotechnical Engineering",
      "BCV503 - Concrete Technology",
      "BCV504 - Environmental Engineering Lab",
      "BCV515A - Numerical Methods in Civil Engineering",
      "BCV515B - Occupational Safety and Health Monitoring",
      "BCV515C - Solid Waste Management",
      "BCV515D - Remote Sensing and GIS",
      "BESK508 - Environmental Studies",
      "BRMK557 - Research Methodology and IPR",
    ],
    "6th Semester": [
      "BCV601 - Design of RCC Structures",
      "BCV602 - Irrigation Engineering and Hydraulic Structures",
      "BCV613A - Design of Bridges",
      "BCV613B - Design of formwork and scaffolding",
      "BCV613C - Applied Geotechnical Engineering",
      "BCV613D - Design and Construction of Highway Pavements",
      "BCV654A - Water conservation and Rainwater Harvesting",
      "BCV654B - Geographic Information Systems",
      "BCV654C - Integrated Waste Management for a Smart City",
      "BCV654D - Sustainable Development Goals",
      "BCV657A - Building Information Modelling - Advanced",
      "BCV657B - Structural Health Monitoring Using Sensors",
      "BCV657C - Data Analytics for Civil Engineers",
      "BCV657D - Quality Control and Quality Assurance",
      "BCVL606 - Software ApplicationLab",
    ],
    "7th Semester": [
      "BCV701 - Design of Steel Structures",
      "BCV702 - Estimation and Contract Management",
      "BCV703 - Prestressed Concrete",
      "BCV714A - Intelligent Transportation Systems",
      "BCV714B - Earthquake Resistant Structures",
      "BCV714C - Design and Execution of Pile Foundations",
      "BCV714D - Building services-hvac, acoustics and fire safety",
      "BCV755A - Road Safety Engineering",
      "BCV755B - Conservation Of Natural Resources",
      "BCV755C - Energy Efficiency, Acoustics And Daylighting In Building",
      "BCV755D - Precast Members – Systems & Construction",
    ],
    "8th Semester": [
      "Green Building",
      "Advanced Concrete",
      "Disaster Management",
      "Infrastructure Development",
      "Internship",
      "Project Work-II",
    ],
  },
  "Electrical and Electronics Engineering": {
    "1st Semester": [
      "BMATX102-202 - Engineering Mathematics-I or Engineering Mathematics-II",
      "BCEDK103-203 - Computer-Aided Engineering Drawing",
      "BCHES102-202 - Applied Chemistry for CSE Stream",
      "BENGK106-206 - Communicative English",
      "BESCK104A-204A - Introduction to Civil Engineering",
      "BESCK104B-204B - Introduction to Electrical Engineering",
      "BESCK104C-204C - Introduction to Electronics Communication",
      "BESCK104D-204D - Introduction to Mechanical Engineering",
      "BESCK104E-204E - Introduction to C Programming",
      "BETCK105A-205A - Smart Materials and Systems",
      "BETCK105B-205B - Green Buildings",
      "BETCK105C-205C - Introduction to Nano Technology",
      "BETCK105D-205D - Introduction to Sustainable Engineering",
      "BETCK105E-205E - Renewable Energy Sources",
      "BETCK105F-205F - Waste Management",
      "BETCK105G-205G - Emerging Applications of Biosensors",
      "BETCK105H-205H - Introduction to Internet of Things (IOT)",
      "BETCK105I-205I - Introduction to Cyber Security",
      "BETCK105J-205J - Introduction to Embedded System",
      "BICOK107-207 - Indian Constitution",
      "BIDTK158-258 - Innovation and Design Thinking",
      "BKBKK107-207 - Balake Kannada",
      "BKSKK107-207 - Samskrutika Kannada",
      "BMATS101 - Mathematics-I for CSE Stream",
      "BPHYS102-202 - Applied Physics for CSE stream",
      "BPLCK105A-205A - Introduction to Web Programming",
      "BPLCK105B-205B - Introduction to Python Programming",
      "BPLCK105C-205C - Basics of JAVA programming",
      "BPLCK105D-205D - Introduction to C++ Programming",
      "BPOPS103-203 - Principles of Programming Using C",
      "BPWSK106-206 - Professional Writing Skills in English",
      "BSFHK158-258 - Scientific Foundations of Health",
    ],
    "2nd Semester": [
      "BMATX102-202 - Engineering Mathematics-I or Engineering Mathematics-II",
      "BCEDK103-203 - Computer-Aided Engineering Drawing",
      "BCHES102-202 - Applied Chemistry for CSE Stream",
      "BENGK106-206 - Communicative English",
      "BESCK104A-204A - Introduction to Civil Engineering",
      "BESCK104B-204B - Introduction to Electrical Engineering",
      "BESCK104C-204C - Introduction to Electronics Communication",
      "BESCK104D-204D - Introduction to Mechanical Engineering",
      "BESCK104E-204E - Introduction to C Programming",
      "BETCK105A-205A - Smart Materials and Systems",
      "BETCK105B-205B - Green Buildings",
      "BETCK105C-205C - Introduction to Nano Technology",
      "BETCK105D-205D - Introduction to Sustainable Engineering",
      "BETCK105E-205E - Renewable Energy Sources",
      "BETCK105F-205F - Waste Management",
      "BETCK105G-205G - Emerging Applications of Biosensors",
      "BETCK105H-205H - Introduction to Internet of Things (IOT)",
      "BETCK105I-205I - Introduction to Cyber Security",
      "BETCK105J-205J - Introduction to Embedded System",
      "BICOK107-207 - Indian Constitution",
      "BIDTK158-258 - Innovation and Design Thinking",
      "BKBKK107-207 - Balake Kannada",
      "BKSKK107-207 - Samskrutika Kannada",
      "BMATS101 - Mathematics-I for CSE Stream",
      "BPHYS102-202 - Applied Physics for CSE stream",
      "BPLCK105A-205A - Introduction to Web Programming",
      "BPLCK105B-205B - Introduction to Python Programming",
      "BPLCK105C-205C - Basics of JAVA programming",
      "BPLCK105D-205D - Introduction to C++ Programming",
      "BPOPS103-203 - Principles of Programming Using C",
      "BPWSK106-206 - Professional Writing Skills in English",
      "BSFHK158-258 - Scientific Foundations of Health",
    ],
    "3rd Semester": [
      "BEE301 - Engineering Mathematics for EEE",
      "BEE302 - Electric Circuit Analysis",
      "BEE303 - Analog Electronic Circuits",
      "BEE304 - Transformers and Generators",
      "BEE306A - Digital Logic Circuits",
      "BEE306B - Electrical Measurements and Instrumentation",
      "BEE306C - Electromagnetic Field Theory",
      "BEE306D - Physics of Electronic Devices",
      "BEEL305 - Transformers and Generators lab",
      "BEEL358A - SCI LAB/MATLAB for Transformers and Generators",
      "BEEL358B - 555 IC Laboratory",
      "BEEL358C - Circuit Laboratory using P Spice",
      "BEEL358D - Electrical Hardware Laboratory",
      "BSCK307 - Social Connect and Responsibility",
    ],
    "4th Semester": [
      "BBOK407 - Biology For Engineers",
      "BEE401 - Electric Motors",
      "BEE402 - Transmission and Distribution",
      "BEE403 - Microcontrollers",
      "BEE405A - Electrical Power Generation and Economics",
      "BEE405B - Op-Amp and LIC",
      "BEE405C - Engineering Materials",
      "BEE405D - Object Oriented Programming",
      "BEEL404 - Electric Motors lab",
      "BEEL456A - Basics of VHDL Lab",
      "BEEL456B - Sci Lab / MATLAB for Electrical and Electronic Measurements",
      "BEEL456C - PCB Design Laboratory",
      "BEEL456D - Aurdino & Rasberry PI Based Projects",
      "BUHK408 - Universal human values course",
    ],
    "5th Semester": [
      "BEE501 - Engineering Management and Entrepreneurship",
      "BEE502 - Signals & DSP",
      "BEE503 - Power Electronics",
      "BEE515A - High Voltage Engineering",
      "BEE515B - Power Electronics for Renewable Energy Systems",
      "BEE515C - Electric Vehicle Fundamentals",
      "BEE515D - Fundamentals of VLSI Design",
      "BEEL504 - Power Electronics Lab",
      "BESK508 - Environmental Studies",
      "BRMK557 - Research Methodology and IPR",
    ],
    "6th Semester": [
      "BEE601 - Power system Analysis - I",
      "BEE602 - Control Systems",
      "BEE613A - Medium Voltage Substation Design",
      "BEE613B - Embedded SystemDesign",
      "BEE613C - FACTS and HVDC Transmission",
      "BEE613D - Electric Motor and Drive Systems for Electric Vehicles",
      "BEE654A - Utilization of Electrical Power",
      "BEE654B - Technologies of Renewable Energy Sources",
      "BEE654C - Industrial Servo Control Systems",
      "BEE654D - Semiconductor Devices",
      "BEE657A - Energy Management in Electric Vehicles",
      "BEEL606 - Control System Lab",
      "BEEL657B - Simulation of Control of Power Electronics Circuits",
      "BEEL657C - Energy Audit Project",
      "BEEL657D - Project on Renewable Energy Sources",
    ],
    "7th Semester": [
      "BEE701 - Switchgear and Protection",
      "BEE702 - Industrial Drives and Applications",
      "BEE703 - Power system analysis-II",
      "BEE714A - Power System Operation and Control",
      "BEE714B - AI Techniques for Electric and Hybrid Electric Vehicles",
      "BEE714C - Programmable Logic Controllers",
      "BEE714D - Big Data Analytics in Power Systems",
      "BEE755A - Electric Vehicle Technologies",
      "BEE755B - Energy Conservation and Audit",
      "BEE755C - PLC and SCADA",
      "BEE755D - Optimisation Techniques",
    ],
    "8th Semester": [
      "Sustainable Energy",
      "Grid Integration",
      "Advanced Control",
      "Power System Stability",
      "Internship",
      "Project Work-II",
    ],
  },
  "Artificial Intelligence and Data Science": {
    "1st Semester": [
      "BMATX102-202 - Engineering Mathematics-I or Engineering Mathematics-II",
      "BCEDK103-203 - Computer-Aided Engineering Drawing",
      "BCHES102-202 - Applied Chemistry for CSE Stream",
      "BENGK106-206 - Communicative English",
      "BESCK104A-204A - Introduction to Civil Engineering",
      "BESCK104B-204B - Introduction to Electrical Engineering",
      "BESCK104C-204C - Introduction to Electronics Communication",
      "BESCK104D-204D - Introduction to Mechanical Engineering",
      "BESCK104E-204E - Introduction to C Programming",
      "BETCK105A-205A - Smart Materials and Systems",
      "BETCK105B-205B - Green Buildings",
      "BETCK105C-205C - Introduction to Nano Technology",
      "BETCK105D-205D - Introduction to Sustainable Engineering",
      "BETCK105E-205E - Renewable Energy Sources",
      "BETCK105F-205F - Waste Management",
      "BETCK105G-205G - Emerging Applications of Biosensors",
      "BETCK105H-205H - Introduction to Internet of Things (IOT)",
      "BETCK105I-205I - Introduction to Cyber Security",
      "BETCK105J-205J - Introduction to Embedded System",
      "BICOK107-207 - Indian Constitution",
      "BIDTK158-258 - Innovation and Design Thinking",
      "BKBKK107-207 - Balake Kannada",
      "BKSKK107-207 - Samskrutika Kannada",
      "BMATS101 - Mathematics-I for CSE Stream",
      "BPHYS102-202 - Applied Physics for CSE stream",
      "BPLCK105A-205A - Introduction to Web Programming",
      "BPLCK105B-205B - Introduction to Python Programming",
      "BPLCK105C-205C - Basics of JAVA programming",
      "BPLCK105D-205D - Introduction to C++ Programming",
      "BPOPS103-203 - Principles of Programming Using C",
      "BPWSK106-206 - Professional Writing Skills in English",
      "BSFHK158-258 - Scientific Foundations of Health",
    ],
    "2nd Semester": [
      "BMATX102-202 - Engineering Mathematics-I or Engineering Mathematics-II",
      "BCEDK103-203 - Computer-Aided Engineering Drawing",
      "BCHES102-202 - Applied Chemistry for CSE Stream",
      "BENGK106-206 - Communicative English",
      "BESCK104A-204A - Introduction to Civil Engineering",
      "BESCK104B-204B - Introduction to Electrical Engineering",
      "BESCK104C-204C - Introduction to Electronics Communication",
      "BESCK104D-204D - Introduction to Mechanical Engineering",
      "BESCK104E-204E - Introduction to C Programming",
      "BETCK105A-205A - Smart Materials and Systems",
      "BETCK105B-205B - Green Buildings",
      "BETCK105C-205C - Introduction to Nano Technology",
      "BETCK105D-205D - Introduction to Sustainable Engineering",
      "BETCK105E-205E - Renewable Energy Sources",
      "BETCK105F-205F - Waste Management",
      "BETCK105G-205G - Emerging Applications of Biosensors",
      "BETCK105H-205H - Introduction to Internet of Things (IOT)",
      "BETCK105I-205I - Introduction to Cyber Security",
      "BETCK105J-205J - Introduction to Embedded System",
      "BICOK107-207 - Indian Constitution",
      "BIDTK158-258 - Innovation and Design Thinking",
      "BKBKK107-207 - Balake Kannada",
      "BKSKK107-207 - Samskrutika Kannada",
      "BMATS101 - Mathematics-I for CSE Stream",
      "BPHYS102-202 - Applied Physics for CSE stream",
      "BPLCK105A-205A - Introduction to Web Programming",
      "BPLCK105B-205B - Introduction to Python Programming",
      "BPLCK105C-205C - Basics of JAVA programming",
      "BPLCK105D-205D - Introduction to C++ Programming",
      "BPOPS103-203 - Principles of Programming Using C",
      "BPWSK106-206 - Professional Writing Skills in English",
      "BSFHK158-258 - Scientific Foundations of Health",
    ],
    "3rd Semester": [
      "BAI358B - Ethics and Public Policy for AI",
      "BAI358D - PHP Programming",
      "BCS301 - Mathematics for Computer Science",
      "BCS302 - Digital Design & Computer Organization",
      "BCS303 - Operating Systems",
      "BCS304 - Data Structures and Applications",
      "BCS306A - Object Oriented Programming with Java",
      "BCS358A - Data analytics with Excel",
      "BCS358C - Project Management with Git",
      "BCSL305 - Data Structures Lab",
      "BSCK307 - Social Connect and Responsibility",
    ],
    "4th Semester": [
      "BAD402 - Artificial Intelligence",
      "BAI405B - Metric Spaces",
      "BAI405D - Algorithmic Game Theory",
      "BBOC407 - Biology For Computer Engineers",
      "BCS401 - Analysis & Design of Algorithms",
      "BCS403 - Database Management Systems",
      "BCS405A - Discrete Mathematical Structures",
      "BCS405C - Optimization Technique",
      "BCSL404 - Analysis & Design of Algorithms Lab",
      "BDSL456A - Scala",
      "BDSL456B - MongoDB",
      "BDSL456C - MERN",
      "BDSL456D - Julia",
      "BUHK408 - Universal human values course",
    ],
    "5th Semester": [
      "BAD515B - Data Warehousing",
      "BAD515C - Cloud Computing",
      "BAI151A - Computer Vision",
      "BAIL504 - Data Visualization Lab",
      "BCS501 - Software Engineering & Project Management",
      "BCS502 - Computer Networks",
      "BCS503 - Theory of Computation",
      "BCS508 - Environmental Studies and E-waste Management",
      "BCS515D - Distributed Systems",
      "BRMK557 - Research Methodology and IPR",
      "BAD601 - Big Data Analytics",
      "BAD613B - Natural Language Processing",
      "BADL657B - UI/UX",
      "BAI613A - Human-Centred AI",
      "BAI613D - Time Series Analysis",
      "BAI654D - Introduction to Artificial Intelligence",
      "BAIL657C - Generative AI",
      "BCGL657A - Mobile Application Development with Flutter",
      "BCS602 - Machine Learning",
      "BCS613A - Blockchain Technology",
      "BCS654A - Introduction to Data Structures",
      "BCS654B - Fundamentals of Operating Systems",
      "BCSL606 - Machine Learning lab",
      "BCSL657D - DevOps",
      "BIS654C - Mobile Application Development",
    ],
    "6th Semester": [
      "BAD601 - Big Data Analytics",
      "BAD613B - Natural Language Processing",
      "BADL657B - UI/UX",
      "BAI613A - Human-Centred AI",
      "BAI613D - Time Series Analysis",
      "BAI654D - Introduction to Artificial Intelligence",
      "BAIL657C - Generative AI",
      "BCGL657A - Mobile Application Development with Flutter",
      "BCS602 - Machine Learning",
      "BCS613A - Blockchain Technology",
      "BCS654A - Introduction to Data Structures",
      "BCS654B - Fundamentals of Operating Systems",
      "BCSL606 - Machine Learning lab",
      "BCSL657D - DevOps",
      "BIS654C - Mobile Application Development",
    ],
    "7th Semester": [
      "BAD702 - Statistical Machine Learning For Data Science",
      "BAD703 - Data Security & Privacy",
      "BAD714A - Scalable Data Systems",
      "BAD714B - Business Analytics",
      "BAD714C - Data Engineering & MLOps",
      "BAD714D - Social Network Analysis",
      "BAI701 - Deep Learning and Reinforcement Learning",
      "BCS755A - Introduction to DBMS",
      "BCS755B - Introduction to Algorithms",
      "BCS755C - Software Engineering",
    ],
    "8th Semester": [
      "Advanced Biotechnology",
      "Process Safety",
      "Clean Technology",
      "Process Economics",
      "Internship",
      "Project Work-II",
    ],
  },
  "Information Science Engineering": {
    "1st Semester": [
      "BMATX102-202 - Engineering Mathematics-I or Engineering Mathematics-II",
      "BCEDK103-203 - Computer-Aided Engineering Drawing",
      "BCHES102-202 - Applied Chemistry for CSE Stream",
      "BENGK106-206 - Communicative English",
      "BESCK104A-204A - Introduction to Civil Engineering",
      "BESCK104B-204B - Introduction to Electrical Engineering",
      "BESCK104C-204C - Introduction to Electronics Communication",
      "BESCK104D-204D - Introduction to Mechanical Engineering",
      "BESCK104E-204E - Introduction to C Programming",
      "BETCK105A-205A - Smart Materials and Systems",
      "BETCK105B-205B - Green Buildings",
      "BETCK105C-205C - Introduction to Nano Technology",
      "BETCK105D-205D - Introduction to Sustainable Engineering",
      "BETCK105E-205E - Renewable Energy Sources",
      "BETCK105F-205F - Waste Management",
      "BETCK105G-205G - Emerging Applications of Biosensors",
      "BETCK105H-205H - Introduction to Internet of Things (IOT)",
      "BETCK105I-205I - Introduction to Cyber Security",
      "BETCK105J-205J - Introduction to Embedded System",
      "BICOK107-207 - Indian Constitution",
      "BIDTK158-258 - Innovation and Design Thinking",
      "BKBKK107-207 - Balake Kannada",
      "BKSKK107-207 - Samskrutika Kannada",
      "BMATS101 - Mathematics-I for CSE Stream",
      "BPHYS102-202 - Applied Physics for CSE stream",
      "BPLCK105A-205A - Introduction to Web Programming",
      "BPLCK105B-205B - Introduction to Python Programming",
      "BPLCK105C-205C - Basics of JAVA programming",
      "BPLCK105D-205D - Introduction to C++ Programming",
      "BPOPS103-203 - Principles of Programming Using C",
      "BPWSK106-206 - Professional Writing Skills in English",
      "BSFHK158-258 - Scientific Foundations of Health",
    ],
    "2nd Semester": [
      "BMATX102-202 - Engineering Mathematics-I or Engineering Mathematics-II",
      "BCEDK103-203 - Computer-Aided Engineering Drawing",
      "BCHES102-202 - Applied Chemistry for CSE Stream",
      "BENGK106-206 - Communicative English",
      "BESCK104A-204A - Introduction to Civil Engineering",
      "BESCK104B-204B - Introduction to Electrical Engineering",
      "BESCK104C-204C - Introduction to Electronics Communication",
      "BESCK104D-204D - Introduction to Mechanical Engineering",
      "BESCK104E-204E - Introduction to C Programming",
      "BETCK105A-205A - Smart Materials and Systems",
      "BETCK105B-205B - Green Buildings",
      "BETCK105C-205C - Introduction to Nano Technology",
      "BETCK105D-205D - Introduction to Sustainable Engineering",
      "BETCK105E-205E - Renewable Energy Sources",
      "BETCK105F-205F - Waste Management",
      "BETCK105G-205G - Emerging Applications of Biosensors",
      "BETCK105H-205H - Introduction to Internet of Things (IOT)",
      "BETCK105I-205I - Introduction to Cyber Security",
      "BETCK105J-205J - Introduction to Embedded System",
      "BICOK107-207 - Indian Constitution",
      "BIDTK158-258 - Innovation and Design Thinking",
      "BKBKK107-207 - Balake Kannada",
      "BKSKK107-207 - Samskrutika Kannada",
      "BMATS101 - Mathematics-I for CSE Stream",
      "BPHYS102-202 - Applied Physics for CSE stream",
      "BPLCK105A-205A - Introduction to Web Programming",
      "BPLCK105B-205B - Introduction to Python Programming",
      "BPLCK105C-205C - Basics of JAVA programming",
      "BPLCK105D-205D - Introduction to C++ Programming",
      "BPOPS103-203 - Principles of Programming Using C",
      "BPWSK106-206 - Professional Writing Skills in English",
      "BSFHK158-258 - Scientific Foundations of Health",
    ],
    "3rd Semester": [
      "BCS301 - Mathematics for Computer Science",
      "BCS302 - Digital Design & Computer Organization",
      "BCS303 - Operating Systems",
      "BCS304 - Data Structures and Applications",
      "BCS306A - Object Oriented Programming with Java",
      "BCS306B - Object Oriented Programming with C++",
      "BCS358A - Data analytics with Excel",
      "BCS358B - R Programming",
      "BCS358C - Project Management with Git",
      "BCS358D - Data Visualization with Python",
      "BCSL305 - Data Structures Lab",
      "BSCK307 - Social Connect and Responsibility",
    ],
    "4th Semester": [
      "BBOC407 - Biology For Computer Engineers",
      "BCS401 - Analysis & Design of Algorithms",
      "BCS403 - Database Management Systems",
      "BCS405A - Discrete Mathematical Structures",
      "BCS405B - Graph Theory",
      "BCS405C - Optimization Technique",
      "BCS405D - Linear Algebra",
      "BCS456A - Green IT and Sustainability",
      "BCS456B - Capacity Planning for IT",
      "BCS456C - UI/UX",
      "BCSL404 - Analysis & Design of Algorithms Lab",
      "BCSL456D - Technical writing using LATEX",
      "BIS402 - Advanced Java",
      "BUHK408 - Universal human values course",
    ],
    "5th Semester": [
      "BAI151A - Computer Vision",
      "BAIL504 - Data Visualization Lab",
      "BCS501 - Software Engineering & Project Management",
      "BCS502 - Computer Networks",
      "BCS503 - Theory of Computation",
      "BCS508 - Environmental Studies and E-waste Management",
      "BCS515B - Artificial Intelligence",
      "BCS515C - Unix System Programming",
      "BCS515D - Distributed Systems",
      "BRMK557 - Research Methodology and IPR",
    ],
    "6th Semester": [
      "BAI654D - Introduction to Artificial Intelligence",
      "BAIL657C - Generative AI",
      "BCS602 - Machine Learning",
      "BCS613A - Blockchain Technology",
      "BCS613C - Compiler Design",
      "BCS654A - Introduction to Data Structures",
      "BCS654B - Fundamentals of Operating Systems",
      "BCSL606 - Machine Learning lab",
      "BCSL657B - React",
      "BCSL657D - Devops",
      "BIS601 - Full Stack Development",
      "BIS613B - Internet of Things",
      "BIS613D - Cloud Computing and Security",
      "BIS654C - Mobile Application Development",
      "BISL657A - Tosca - Automated Software testing",
    ],
    "7th Semester": [
      "BAD714D - Social Network Analysis",
      "BCS702 - Parallel Computing",
      "BCS714A - Deep Learning",
      "BCS755A - Introduction to DBMS",
      "BCS755B - Introduction to Algorithms",
      "BCS755C - Software Engineering",
      "BIS701 - Big Data Analytics",
      "BIS703 - Information & Network Security",
      "BIS714B - Software Quality Assurance",
      "BIS714C - Embedded Systems",
    ],
    "8th Semester": [
      "BIS801 - Information Systems Strategy",
      "BIS802 - Advanced Research in Information Systems",
      "BIS803 - Information Systems Innovation",
      "BIS804 - Global Information Systems",
      "Internship",
      "Project Work-II",
    ],
  },
  "Artificial Intelligence & Machine Learning": {
    "1st Semester": [
      "BMATX102-202 - Engineering Mathematics-I or Engineering Mathematics-II",
      "BCEDK103-203 - Computer-Aided Engineering Drawing",
      "BCHES102-202 - Applied Chemistry for CSE Stream",
      "BENGK106-206 - Communicative English",
      "BESCK104A-204A - Introduction to Civil Engineering",
      "BESCK104B-204B - Introduction to Electrical Engineering",
      "BESCK104C-204C - Introduction to Electronics Communication",
      "BESCK104D-204D - Introduction to Mechanical Engineering",
      "BESCK104E-204E - Introduction to C Programming",
      "BETCK105A-205A - Smart Materials and Systems",
      "BETCK105B-205B - Green Buildings",
      "BETCK105C-205C - Introduction to Nano Technology",
      "BETCK105D-205D - Introduction to Sustainable Engineering",
      "BETCK105E-205E - Renewable Energy Sources",
      "BETCK105F-205F - Waste Management",
      "BETCK105G-205G - Emerging Applications of Biosensors",
      "BETCK105H-205H - Introduction to Internet of Things (IOT)",
      "BETCK105I-205I - Introduction to Cyber Security",
      "BETCK105J-205J - Introduction to Embedded System",
      "BICOK107-207 - Indian Constitution",
      "BIDTK158-258 - Innovation and Design Thinking",
      "BKBKK107-207 - Balake Kannada",
      "BKSKK107-207 - Samskrutika Kannada",
      "BMATS101 - Mathematics-I for CSE Stream",
      "BPHYS102-202 - Applied Physics for CSE stream",
      "BPLCK105A-205A - Introduction to Web Programming",
      "BPLCK105B-205B - Introduction to Python Programming",
      "BPLCK105C-205C - Basics of JAVA programming",
      "BPLCK105D-205D - Introduction to C++ Programming",
      "BPOPS103-203 - Principles of Programming Using C",
      "BPWSK106-206 - Professional Writing Skills in English",
      "BSFHK158-258 - Scientific Foundations of Health",
    ],
    "2nd Semester": [
      "BMATX102-202 - Engineering Mathematics-I or Engineering Mathematics-II",
      "BCEDK103-203 - Computer-Aided Engineering Drawing",
      "BCHES102-202 - Applied Chemistry for CSE Stream",
      "BENGK106-206 - Communicative English",
      "BESCK104A-204A - Introduction to Civil Engineering",
      "BESCK104B-204B - Introduction to Electrical Engineering",
      "BESCK104C-204C - Introduction to Electronics Communication",
      "BESCK104D-204D - Introduction to Mechanical Engineering",
      "BESCK104E-204E - Introduction to C Programming",
      "BETCK105A-205A - Smart Materials and Systems",
      "BETCK105B-205B - Green Buildings",
      "BETCK105C-205C - Introduction to Nano Technology",
      "BETCK105D-205D - Introduction to Sustainable Engineering",
      "BETCK105E-205E - Renewable Energy Sources",
      "BETCK105F-205F - Waste Management",
      "BETCK105G-205G - Emerging Applications of Biosensors",
      "BETCK105H-205H - Introduction to Internet of Things (IOT)",
      "BETCK105I-205I - Introduction to Cyber Security",
      "BETCK105J-205J - Introduction to Embedded System",
      "BICOK107-207 - Indian Constitution",
      "BIDTK158-258 - Innovation and Design Thinking",
      "BKBKK107-207 - Balake Kannada",
      "BKSKK107-207 - Samskrutika Kannada",
      "BMATS101 - Mathematics-I for CSE Stream",
      "BPHYS102-202 - Applied Physics for CSE stream",
      "BPLCK105A-205A - Introduction to Web Programming",
      "BPLCK105B-205B - Introduction to Python Programming",
      "BPLCK105C-205C - Basics of JAVA programming",
      "BPLCK105D-205D - Introduction to C++ Programming",
      "BPOPS103-203 - Principles of Programming Using C",
      "BPWSK106-206 - Professional Writing Skills in English",
      "BSFHK158-258 - Scientific Foundations of Health",
    ],
    "3rd Semester": [
      "BAI358B - Ethics and Public Policy for AI",
      "BAI358D - PHP Programming",
      "BCS301 - Mathematics for Computer Science",
      "BCS302 - Digital Design & Computer Organization",
      "BCS303 - Operating Systems",
      "BCS304 - Data Structures and Applications",
      "BCS306A - Object Oriented Programming with Java",
      "BCS358A - Data analytics with Excel",
      "BCS358C - Project Management with Git",
      "BCSL305 - Data Structures Lab",
      "BDS306B - Python Programming for Data Science",
      "BDS306C - Data Analytics with R",
      "BSCK307 - Social Connect and Responsibility",
    ],
    "4th Semester": [
      "BAD402 - Artificial Intelligence",
      "BAI405B - Metric Spaces",
      "BAI405D - Algorithmic Game Theory",
      "BBOC407 - Biology For Computer Engineers",
      "BCS401 - Analysis & Design of Algorithms",
      "BCS403 - Database Management Systems",
      "BCS405A - Discrete Mathematical Structures",
      "BCS405C - Optimization Technique",
      "BCSL404 - Analysis & Design of Algorithms Lab",
      "BDSL456A - Scala",
      "BDSL456B - MongoDB",
      "BDSL456C - MERN",
      "BDSL456D - Julia",
      "BUHK408 - Universal human values course",
    ],
    "5th Semester": [
      "BAI151A - Computer Vision",
      "BAI545B - Information Retrieval",
      "BAI515E - Exploratory Data Analysis",
      "BAIL504 - Data Visualization Lab",
      "BCS501 - Software Engineering & Project Management",
      "BCS502 - Computer Networks",
      "BCS503 - Theory of Computation",
      "BCS508 - Environmental Studies and E-waste Management",
      "BCS515C - Unix System Programming",
      "BCS515D - Distributed Systems",
      "BRMK557 - Research Methodology and IPR",
    ],
    "6th Semester": [
      "BADL657B - UI/UX",
      "BAI601 - Natural Language Processing",
      "BAI602 - Machine Learning -I",
      "BAI613A - Human-Centred AI",
      "BAI613D - Time Series Analysis",
      "BAI654D - Introduction to Artificial Intelligence",
      "BAIL606 - Machine Learning lab",
      "BAIL657C - Generative AI",
      "BCGL657A - Mobile Application Development with Flutter",
      "BCS613A - Blockchain Technology",
      "BCS654A - Introduction to Data Structures",
      "BCS654B - Fundamentals of Operating Systems",
      "BCSL657D - DevOps",
      "BIS613D - Cloud Computing and Security",
      "BIS654C - Mobile Application Development",
    ],
    "7th Semester": [
      "BAD703 - Data Security & Privacy",
      "BAD714B - Business Analytics",
      "BAD714C - Data Engineering & MLOps",
      "BAD714D - Social Network Analysis",
      "BAI701 - Deep Learning and Reinforcement Learning",
      "BAI702 - Machine Learning -II",
      "BCS714D - Big Data Analytics",
      "BCS755A - Introduction to DBMS",
      "BCS755B - Introduction to Algorithms",
      "BCS755C - Software Engineering",
    ],
    "8th Semester": [
      "AI Applications",
      "Explainable AI",
      "Edge AI",
      "AI Optimization",
      "Internship",
      "Project Work-II",
    ],
  },
};

// Nested subjects for ESC and PSC courses
const NESTED_SUBJECTS = {
  "Engineering Science Courses - I (ESC-I)": [
    "BCEDK103-203 - Computer-Aided Engineering Drawing",
    "BCHES102-202 - Applied Chemistry for CSE Stream",
    "BENGK106-206 - Communicative English",
    "BESCK104A-204A - Introduction to Civil Engineering",
    "BESCK104B-204B - Introduction to Electrical Engineering",
    "BESCK104C-204C - Introduction to Electronics Communication",
    "BESCK104D-204D - Introduction to Mechanical Engineering",
    "BESCK104E-204E - Introduction to C Programming",
    "BETCK105A-205A - Smart Materials and Systems",
    "BETCK105B-205B - Green Buildings",
    "BETCK105C-205C - Introduction to Nano Technology",
    "BETCK105D-205D - Introduction to Sustainable Engineering",
    "BETCK105E-205E - Renewable Energy Sources",
    "BETCK105F-205F - Waste Management",
    "BETCK105G-205G - Emerging Applications of Biosensors",
    "BETCK105H-205H - Introduction to Internet of Things (IOT)",
    "BETCK105I-205I - Introduction to Cyber Security",
    "BETCK105J-205J - Introduction to Embedded System",
    "BICOK107-207 - Indian Constitution",
    "BIDTK158-258 - Innovation and Design Thinking",
  ],
  "Engineering Science Courses - II (ESC-II)": [
    "BCEDK103-203 - Computer-Aided Engineering Drawing",
    "BCHES102-202 - Applied Chemistry for CSE Stream",
    "BENGK106-206 - Communicative English",
    "BESCK104A-204A - Introduction to Civil Engineering",
    "BESCK104B-204B - Introduction to Electrical Engineering",
    "BESCK104C-204C - Introduction to Electronics Communication",
    "BESCK104D-204D - Introduction to Mechanical Engineering",
    "BESCK104E-204E - Introduction to C Programming",
    "BETCK105A-205A - Smart Materials and Systems",
    "BETCK105B-205B - Green Buildings",
    "BETCK105C-205C - Introduction to Nano Technology",
    "BETCK105D-205D - Introduction to Sustainable Engineering",
    "BETCK105E-205E - Renewable Energy Sources",
    "BETCK105F-205F - Waste Management",
    "BETCK105G-205G - Emerging Applications of Biosensors",
    "BETCK105H-205H - Introduction to Internet of Things (IOT)",
    "BETCK105I-205I - Introduction to Cyber Security",
    "BETCK105J-205J - Introduction to Embedded System",
    "BICOK107-207 - Indian Constitution",
    "BIDTK158-258 - Innovation and Design Thinking",
  ],
  "Programme Specific Courses (PSC)": [
    "BKBKK107-207 - Balake Kannada",
    "BKSKK107-207 - Samskrutika Kannada",
    "BMATS101 - Mathematics-I for CSE Stream",
    "BPHYS102-202 - Applied Physics for CSE stream",
    "BPLCK105A-205A - Introduction to Web Programming",
    "BPLCK105B-205B - Introduction to Python Programming",
    "BPLCK105C-205C - Basics of JAVA programming",
    "BPLCK105D-205D - Introduction to C++ Programming",
    "BPOPS103-203 - Principles of Programming Using C",
    "BPWSK106-206 - Professional Writing Skills in English",
    "BSFHK158-258 - Scientific Foundations of Health",
  ],
};

export default function Contribute() {
  const { user, isAuthenticated } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const [showSemesterDropdown, setShowSemesterDropdown] = useState(false);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showNestedSubjectDropdown, setShowNestedSubjectDropdown] =
    useState(false);
  const [formData, setFormData] = useState({
    university: "",
    semester: "",
    branch: "",
    subject: "",
    nestedSubject: "",
    documentType: "Notes",
  });

  // Filter universities based on search input
  const filteredUniversities = useMemo(() => {
    if (!formData.university) return KARNATAKA_UNIVERSITIES.slice(0, 10);
    return KARNATAKA_UNIVERSITIES.filter((uni) =>
      uni.toLowerCase().includes(formData.university.toLowerCase())
    ).slice(0, 10);
  }, [formData.university]);


  // Get available branches for selected semester
  const availableBranches = useMemo(() => {
    if (!formData.semester) return [];
    return (
      SEMESTER_BRANCHES[formData.semester as keyof typeof SEMESTER_BRANCHES] ||
      []
    );
  }, [formData.semester]);

  // Get available subjects for selected semester and branch
  const availableSubjects = useMemo(() => {
    if (!formData.semester || !formData.branch) return [];
    const branchData =
      BRANCH_SUBJECTS[formData.branch as keyof typeof BRANCH_SUBJECTS];
    if (!branchData) return [];
    return branchData[formData.semester as keyof typeof branchData] || [];
  }, [formData.semester, formData.branch]);

  // Get nested subjects for ESC and PSC courses
  const availableNestedSubjects = useMemo(() => {
    if (
      !formData.subject ||
      !NESTED_SUBJECTS[formData.subject as keyof typeof NESTED_SUBJECTS]
    )
      return [];
    return (
      NESTED_SUBJECTS[formData.subject as keyof typeof NESTED_SUBJECTS] || []
    );
  }, [formData.subject]);

  // Check if selected subject has nested subjects
  const hasNestedSubjects = useMemo(() => {
    return (
      formData.subject &&
      NESTED_SUBJECTS[formData.subject as keyof typeof NESTED_SUBJECTS]
    );
  }, [formData.subject]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset dependent fields when parent fields change
    if (name === "semester") {
      setFormData((prev) => ({
        ...prev,
        semester: value,
        branch: "",
        subject: "",
        nestedSubject: "",
      }));
    } else if (name === "branch") {
      setFormData((prev) => ({
        ...prev,
        branch: value,
        subject: "",
        nestedSubject: "",
      }));
    } else if (name === "subject") {
      setFormData((prev) => ({ ...prev, subject: value, nestedSubject: "" }));
    }

    // Show/hide dropdowns based on input
    if (name === "university") {
      setShowUniversityDropdown(value.length > 0);
    }
  };

  const handleSelectUniversity = (university: string) => {
    setFormData((prev) => ({ ...prev, university }));
    setShowUniversityDropdown(false);
  };


  const handleSelectSemester = (semester: string) => {
    setFormData((prev) => ({ ...prev, semester, branch: "", subject: "" }));
    setShowSemesterDropdown(false);
  };

  const handleSelectBranch = (branch: string) => {
    setFormData((prev) => ({ ...prev, branch, subject: "" }));
    setShowBranchDropdown(false);
  };

  const handleSelectSubject = (subject: string) => {
    setFormData((prev) => ({ ...prev, subject, nestedSubject: "" }));
    setShowSubjectDropdown(false);
  };

  const handleSelectNestedSubject = (nestedSubject: string) => {
    setFormData((prev) => ({ ...prev, nestedSubject }));
    setShowNestedSubjectDropdown(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("📁 File selected:", file);
    
    if (file) {
      console.log("📄 File details:", {
        name: file.name,
        type: file.type,
        size: file.size,
        sizeMB: (file.size / 1024 / 1024).toFixed(2) + "MB"
      });
      
      if (file.type === "application/pdf" && file.size <= 50 * 1024 * 1024) {
        // 50MB limit for Cloudinary
        setSelectedFile(file);
        toast.success(
          `📄 Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(
            1
          )}MB)`,
          {
            duration: 3000,
          }
        );
      } else {
        let errorMsg = "❌ Please select a PDF file under 50MB";
        if (file.type !== "application/pdf") {
          errorMsg = `❌ Invalid file type: ${file.type}. Only PDF files are allowed.`;
        } else if (file.size > 50 * 1024 * 1024) {
          errorMsg = `❌ File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum size is 50MB.`;
        }
        
        console.error("❌ File validation failed:", {
          type: file.type,
          size: file.size,
          expectedType: "application/pdf",
          maxSize: 50 * 1024 * 1024
        });
        
        toast.error(errorMsg, {
          duration: 4000,
        });
      }
    } else {
      console.log("❌ No file selected");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error("🔒 Please log in to upload documents", {
        duration: 4000,
      });
      return;
    }

    if (!selectedFile) {
      toast.error("📄 Please select a file to upload", {
        duration: 3000,
      });
      return;
    }

    if (!formData.semester || !formData.branch || !formData.subject) {
      toast.error(
        "📝 Please fill in all required fields (Semester, Branch, Subject)",
        {
          duration: 4000,
        }
      );
      return;
    }

    // Check if nested subject is required but not selected
    if (hasNestedSubjects && !formData.nestedSubject) {
      const subjectType = formData.subject.includes("ESC") ? "ESC" : "PSC";
      toast.error(`📝 Please select a specific ${subjectType} subject`, {
        duration: 4000,
      });
      return;
    }

    console.log("🚀 Starting upload process...");
    console.log("👤 User:", user.uid, user.email);
    console.log("📄 File:", {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      sizeMB: (selectedFile.size / 1024 / 1024).toFixed(2) + "MB"
    });
    console.log("📝 Form Data:", formData);
    console.log("🔧 Environment check:", {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    });

    setIsUploading(true);
    setUploadProgress(0);
    setUploadSpeed(0);
    setEstimatedTime(0);

    const startTime = Date.now(); // Track upload start time

    try {
      // Use API-based upload to Cloudinary (since we have credentials)
      const uploadResult = await uploadViaAPI(
        selectedFile,
        user.uid,
        (progress: number) => {
          setUploadProgress(progress);
          // Update upload speed and time estimates based on progress
          const currentTime = Date.now();
          const elapsed = (currentTime - startTime) / 1000; // seconds
          if (elapsed > 0 && progress > 0) {
            const bytesUploaded = (selectedFile.size * progress) / 100;
            const speed = bytesUploaded / elapsed; // bytes per second
            setUploadSpeed(speed);

            if (progress < 100) {
              const remainingBytes = selectedFile.size - bytesUploaded;
              const remainingTime = remainingBytes / speed;
              setEstimatedTime(remainingTime);
            }
          }
        }
      );

      console.log("Upload result:", uploadResult);

      if (!uploadResult.success) {
        console.error("Upload failed:", uploadResult.error);
        toast.error(
          `❌ Upload failed: ${uploadResult.error || "Unknown error"}`,
          {
            duration: 5000,
          }
        );
        return;
      }

      // Save document metadata to Firestore
      const finalSubject = formData.nestedSubject || formData.subject;
      const docData = {
        ...formData,
        subject: finalSubject, // Use the nested subject if available, otherwise use the main subject
        title: `${finalSubject} - ${formData.documentType}`, // Generate title from final subject and type
        uploadedBy: user.email, // Use email instead of UID for consistency
        uploaderName: user.displayName || user.email.split("@")[0],
        uploaderEmail: user.email,
        fileUrl: uploadResult.fileUrl,
        filePath: uploadResult.publicId, // Add filePath for downloads
        fileId: uploadResult.fileId,
        publicId: uploadResult.publicId, // Cloudinary public ID for management
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        status: "pending",
        uploadedAt: new Date(),
        downloads: 0,
        likes: 0,
        views: 0,
        storageType: "cloudinary", // Indicate this is stored in Cloudinary
      };

      setUploadProgress(90);
      await addDoc(collection(db, "documents"), docData);
      setUploadProgress(100);

      // Reset form
      setFormData({
        university: "",
        semester: "",
        branch: "",
        subject: "",
        nestedSubject: "",
        documentType: "Notes",
      });
      setSelectedFile(null);

      // Success notification
      toast.success(
        "🎉 Document uploaded successfully! It will be reviewed before being published.",
        {
          duration: 6000,
        }
      );
    } catch (error: unknown) {
      console.error("❌ Upload error:", error);
      console.error("❌ Error details:", {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
        // Provide more specific error messages
        if (error.message.includes('Network')) {
          errorMessage = "Network error. Please check your internet connection.";
        } else if (error.message.includes('Cloudinary')) {
          errorMessage = "Upload service error. Please try again.";
        } else if (error.message.includes('Firestore')) {
          errorMessage = "Database error. Please try again.";
        }
      }
      
      toast.error(`❌ Failed to upload document: ${errorMessage}`, {
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadSpeed(0);
      setEstimatedTime(0);
    }
  };

  // Test upload API connectivity
  const testUploadAPI = async () => {
    try {
      console.log("🔍 Testing upload API connectivity...");
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: true })
      });
      console.log("📡 API test response status:", response.status);
      const responseText = await response.text();
      console.log("📡 API test response:", responseText);
      
      if (response.ok) {
        toast.success("✅ Upload API is working!", { duration: 3000 });
      } else {
        toast.error(`❌ Upload API error: ${response.status}`, { duration: 5000 });
      }
    } catch (error) {
      console.error("❌ API test failed:", error);
      toast.error("❌ Upload API test failed - check console for details", { duration: 5000 });
    }
  };

  // Check environment variables
  const checkEnvironment = () => {
    console.log("🔧 Environment Variables Check:");
    console.log("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
    console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing");
    console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing");
    
    const hasCloudName = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const hasApiKey = !!process.env.CLOUDINARY_API_KEY;
    const hasApiSecret = !!process.env.CLOUDINARY_API_SECRET;
    
    if (hasCloudName && hasApiKey && hasApiSecret) {
      toast.success("✅ All Cloudinary credentials are set!", { duration: 3000 });
    } else {
      toast.error("❌ Missing Cloudinary credentials - check environment variables", { duration: 5000 });
    }
  };

  // Create a test PDF file for testing
  const createTestPDF = () => {
    try {
      // Create a simple text content
      const content = "This is a test PDF file for upload testing.";
      
      // Create a blob with PDF-like content (this is just for testing)
      const blob = new Blob([content], { type: 'application/pdf' });
      const file = new File([blob], 'test-upload.pdf', { type: 'application/pdf' });
      
      console.log("📄 Created test PDF file:", {
        name: file.name,
        type: file.type,
        size: file.size
      });
      
      setSelectedFile(file);
      toast.success("📄 Test PDF file created and selected!", { duration: 3000 });
    } catch (error) {
      console.error("❌ Failed to create test PDF:", error);
      toast.error("❌ Failed to create test PDF file", { duration: 3000 });
    }
  };

  // Show toast for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated && user === null) {
      toast.error("🔒 Please log in to contribute content", {
        duration: 4000,
      });
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
          <p className="text-muted-foreground">
            You need to be logged in to contribute content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-4">
            Share Engineering Knowledge
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            Share your notes and help fellow engineers succeed. Your
            contributions build the future!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-white text-lg sm:text-xl">Upload Document</CardTitle>
                <CardDescription className="text-gray-400 text-sm sm:text-base">
                  Fill in the details below to share your academic resources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">
                      Basic Information
                    </h3>
                    {/* Semester Selection */}
                    <div className="relative">
                      <Label htmlFor="semester" className="text-foreground">
                        Semester *
                      </Label>
                      <div className="relative">
                        <Input
                          id="semester"
                          name="semester"
                          value={formData.semester}
                          onChange={handleInputChange}
                          onFocus={() => setShowSemesterDropdown(true)}
                          onBlur={() =>
                            setTimeout(
                              () => setShowSemesterDropdown(false),
                              200
                            )
                          }
                          placeholder="Select semester..."
                          className="mt-1 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background/80 focus:border-primary pr-10"
                          readOnly
                        />
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none mt-0.5" />
                        {showSemesterDropdown && (
                          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg backdrop-blur-sm">
                            {SEMESTERS.map((semester, index) => (
                              <div
                                key={index}
                                onClick={() => handleSelectSemester(semester)}
                                className="px-3 py-2 hover:bg-accent cursor-pointer text-popover-foreground text-sm border-b border-border last:border-b-0"
                              >
                                {semester}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Branch Selection */}
                    <div className="relative">
                      <Label htmlFor="branch" className="text-foreground">
                        Branch *
                      </Label>
                      <div className="relative">
                        <Input
                          id="branch"
                          name="branch"
                          value={formData.branch}
                          onChange={handleInputChange}
                          onFocus={() =>
                            setShowBranchDropdown(!!formData.semester)
                          }
                          onBlur={() =>
                            setTimeout(() => setShowBranchDropdown(false), 200)
                          }
                          placeholder={
                            formData.semester
                              ? "Select branch..."
                              : "Please select semester first"
                          }
                          className="mt-1 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background/80 focus:border-primary pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!formData.semester}
                          readOnly
                        />
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none mt-0.5" />
                        {showBranchDropdown && availableBranches.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto backdrop-blur-sm">
                            {availableBranches.map((branch, index) => (
                              <div
                                key={index}
                                onClick={() => handleSelectBranch(branch)}
                                className="px-3 py-2 hover:bg-accent cursor-pointer text-popover-foreground text-sm border-b border-border last:border-b-0"
                              >
                                {branch}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Subject Selection */}
                    <div className="relative">
                      <Label htmlFor="subject" className="text-foreground">
                        Subject *
                      </Label>
                      <div className="relative">
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          onFocus={() =>
                            setShowSubjectDropdown(
                              !!formData.branch && !!formData.semester
                            )
                          }
                          onBlur={() =>
                            setTimeout(() => setShowSubjectDropdown(false), 200)
                          }
                          placeholder={
                            formData.branch
                              ? "Select subject..."
                              : "Please select branch first"
                          }
                          className="mt-1 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background/80 focus:border-primary pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!formData.branch || !formData.semester}
                          readOnly
                        />
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none mt-0.5" />
                        {showSubjectDropdown &&
                          availableSubjects.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto backdrop-blur-sm">
                              {availableSubjects.map((subject, index) => (
                                <div
                                  key={index}
                                  onClick={() => handleSelectSubject(subject)}
                                  className="px-3 py-2 hover:bg-accent cursor-pointer text-popover-foreground text-sm border-b border-border last:border-b-0"
                                >
                                  {subject}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Nested Subject Selection - Only show if subject has nested options */}
                    {hasNestedSubjects && (
                      <div className="relative">
                        <Label
                          htmlFor="nestedSubject"
                          className="text-foreground"
                        >
                          {formData.subject.includes("ESC")
                            ? "Select ESC Subject"
                            : "Select PSC Subject"}{" "}
                          *
                        </Label>
                        <div className="relative">
                          <Input
                            id="nestedSubject"
                            name="nestedSubject"
                            value={formData.nestedSubject}
                            onChange={handleInputChange}
                            onFocus={() => setShowNestedSubjectDropdown(true)}
                            onBlur={() =>
                              setTimeout(
                                () => setShowNestedSubjectDropdown(false),
                                200
                              )
                            }
                            placeholder="Select specific subject..."
                            className="mt-1 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background/80 focus:border-primary pr-10"
                            readOnly
                          />
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none mt-0.5" />
                          {showNestedSubjectDropdown &&
                            availableNestedSubjects.length > 0 && (
                              <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto backdrop-blur-sm">
                                {availableNestedSubjects.map(
                                  (nestedSubject, index) => (
                                    <div
                                      key={index}
                                      onClick={() =>
                                        handleSelectNestedSubject(nestedSubject)
                                      }
                                      className="px-3 py-2 hover:bg-accent cursor-pointer text-popover-foreground text-sm border-b border-border last:border-b-0"
                                    >
                                      {nestedSubject}
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Label htmlFor="university" className="text-foreground">
                          University
                        </Label>
                        <div className="relative">
                          <Input
                            id="university"
                            name="university"
                            value={formData.university}
                            onChange={handleInputChange}
                            onFocus={() => setShowUniversityDropdown(true)}
                            onBlur={() =>
                              setTimeout(
                                () => setShowUniversityDropdown(false),
                                200
                              )
                            }
                            placeholder="Start typing to search universities..."
                            className="mt-1 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background/80 focus:border-primary pr-10"
                          />
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none mt-0.5" />
                        </div>
                        {showUniversityDropdown &&
                          filteredUniversities.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto backdrop-blur-sm">
                              {filteredUniversities.map((university, index) => (
                                <div
                                  key={index}
                                  onClick={() =>
                                    handleSelectUniversity(university)
                                  }
                                  className="px-3 py-2 hover:bg-accent cursor-pointer text-popover-foreground text-sm border-b border-border last:border-b-0"
                                >
                                  {university}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>

                    </div>

                    <div>
                      <Label htmlFor="documentType" className="text-foreground">
                        Document Type
                      </Label>
                      <select
                        id="documentType"
                        name="documentType"
                        value={formData.documentType}
                        onChange={handleInputChange}
                        title="Select document type"
                        className="mt-1 w-full px-3 py-2 bg-background/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      >
                        <option value="Notes">
                          Notes
                        </option>
                        <option value="Lab Manual">
                          Lab Manual
                        </option>
                        <option value="Question Paper">
                          Question Paper
                        </option>
                        <option value="Assignment">
                          Assignment
                        </option>
                        <option value="Syllabus">
                          Syllabus
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      File Upload
                    </h3>

                    <div className="border-2 border-dashed border-white/20 rounded-lg p-4 sm:p-6 md:p-8 text-center bg-white/5">
                      <Upload className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-purple-400 mx-auto mb-3 sm:mb-4" />
                      <h4 className="text-base sm:text-lg font-medium text-white mb-2">
                        Upload your PDF
                      </h4>
                      <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base break-words">
                        {selectedFile
                          ? selectedFile.name
                          : "Select a PDF file to upload (Max 50MB)"}
                      </p>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                        disabled={isUploading}
                      />
                      <label htmlFor="file-upload">
                        <Button
                          type="button"
                          className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() =>
                            document.getElementById("file-upload")?.click()
                          }
                          disabled={isUploading}
                        >
                          {isUploading ? "Uploading..." : "Choose File"}
                        </Button>
                      </label>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-6">
                    {isUploading && (
                      <div className="mb-4 space-y-2">
                        <div className="flex justify-between text-sm text-white/70">
                          <span>Uploading... {uploadProgress.toFixed(1)}%</span>
                          <span>
                            {uploadSpeed > 0 && (
                              <>
                                {(uploadSpeed / 1024 / 1024).toFixed(1)} MB/s
                                {estimatedTime > 0 &&
                                  ` • ${Math.ceil(estimatedTime)}s remaining`}
                              </>
                            )}
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300`}
                            style={{
                              width: `${Math.min(uploadProgress, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                    <Button
                      type="submit"
                      disabled={isUploading || !selectedFile}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      {isUploading
                        ? `Uploading... ${uploadProgress.toFixed(0)}%`
                        : "Submit for Review"}
                    </Button>
                    
                    {/* Diagnostic Buttons - Remove in production */}
                    <div className="mt-4 space-y-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={checkEnvironment}
                        className="w-full text-xs"
                      >
                        🔧 Check Environment Variables
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={testUploadAPI}
                        className="w-full text-xs"
                      >
                        📡 Test Upload API
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={createTestPDF}
                        className="w-full text-xs"
                      >
                        📄 Create Test PDF
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Guidelines Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="h-5 w-5" />
                  Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Upload only PDF files</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• Ensure content is your own or you have permission</li>
                  <li>• Provide clear, descriptive titles</li>
                  <li>• Include relevant tags for better discoverability</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="h-5 w-5" />
                  Review Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-gray-300">You upload your document</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-gray-300">
                        Our moderators review the content
                      </p>
                      <p className="text-gray-400 text-xs">
                        Review typically takes 24-48 hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-400 mt-0.5" />
                    <div>
                      <p className="text-gray-300">
                        Document goes live for students
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
