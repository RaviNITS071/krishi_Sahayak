# 🌾 Krishi Sahayak – Bridging the Gap Between Farmers and Government Schemes

## 🚨 Problem Statement

Every year, the Government of India allocates **thousands of crores** in agricultural welfare schemes.

📊 Example (Union Budget Data):
- ₹60,000+ crore allocated annually under PM-KISAN
- ₹1,25,000+ crore for agriculture & allied sectors (Union Budget 2024–25)
- 100+ central & state schemes available for farmers

👉 BUT REALITY:

- ❌ **40–60% farmers are unaware** of schemes they are eligible for  
- ❌ Benefits often **fail to reach small & marginal farmers**  
- ❌ Keypad phone users (non-smartphone) are completely excluded  
- ❌ Complex paperwork & lack of awareness block access  

📉 Result:
> Government funds remain underutilized, while farmers remain underserved.

---

## 💡 Our Solution: Krishi Sahayak

An **AI-powered MERN application** that:

✅ Identifies schemes a farmer is eligible for  
✅ Explains them in simple Hindi  
✅ Calls farmers directly using AI voice  
✅ Targets even **non-smartphone users**

---

## 🔥 Key Innovation

> 📞 “If farmers can't reach schemes, schemes should reach farmers.”

We use **AI voice calling via Twilio** to:

- Speak directly to farmers  
- Explain benefits clearly  
- Remove dependency on smartphones  

---

## ⚙️ How Our System Works

### 👨‍🌾 Farmer Flow

1. Farmer logs in via OTP  
2. Backend filters schemes based on:
   - Income
   - Land size
   - Caste
   - Location
3. Only **relevant schemes** are shown  
4. Farmer can view:
   - Benefits
   - Required documents
   - Apply link  

---

### 🧑‍💼 Admin Flow

1. Admin logs in  
2. Sees list of **keypad users**
3. Clicks **“Trigger AI Call”**
4. System:
   - Fetches eligible schemes
   - Generates Hindi voice response
   - Calls farmer using Twilio  

---

### 🤖 AI Voice Assistant

During the call:

- Greets farmer by name  
- Lists eligible schemes  
- Explains benefits clearly  
- Asks for response (Yes/No)  

---

## 🧠 Real-World Logic Implemented

Our system uses **eligibility filtering logic**:
USING algorithm :-
farmer.annualIncome <= scheme.maxIncome &&
scheme.allowedCastes.includes(farmer.caste) &&
scheme.targetStates.includes(farmer.location.state)


## 🚀 Future Improvements


- 🤖 GPT-based conversational AI
- 🔐 JWT Authentication
- 📊 Real application tracking (backend)
- 🌐 Multi-language support
- 📈 Analytics dashboard


## 📘 User Manual

This section explains how different users can interact with the system.

---

## 👨‍🌾 Farmer (User Side)

### 🔐 Step 1: Login via Mobile Number
- Open the application
- Enter your **10-digit mobile number**
- Click **“Get OTP”**

---

### 🔑 Step 2: Verify OTP
- Enter the OTP received
- Click **“Verify & Login”**

---

### 📊 Step 3: View Recommended Schemes
- After login, you will see:
  - ✅ Eligible government schemes
  - 💰 Benefits
  - 📄 Required documents

---

### 📄 Step 4: View Scheme Details
- Click **“Verify & Apply”**
- You can see:
  - Required documents
  - CSC charges
  - Official apply link

---

### 🔍 Step 5: Track Application Status (Demo)
- Click **“Track Status” tab**
- Enter application number: 12345678999
- 
- Click **Submit**
- System will show:
  - ✔ Application found OR ❌ Not found

---

## 🧑‍💼 Admin (Staff Side)

### 🔐 Step 1: Admin Login
- Click **“Admin Portal”**
- Enter:
  - Username: `admin`
  - Password: `12345`

---

### 📋 Step 2: View Keypad Farmers
- See list of farmers who:
  - Use keypad phones
  - Need assistance

---

### 📞 Step 3: Trigger AI Call
- Click **“Trigger AI Call”**
- System will:
  - Call the farmer
  - Speak in Hindi
  - Explain eligible schemes

---

## 📞 AI Call Experience

During the call:

- 👋 Greets farmer by name  
- 📢 Explains schemes  
- 💰 Mentions benefits  
- ❓ Asks for response  

---

## ⚠️ Notes

- 📶 Internet required for web app  
- 📞 Twilio trial accounts only call verified numbers  

---

## 🧪 Demo Data

Use this number for testing:




