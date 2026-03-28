const mongoose = require('mongoose');

// ==========================================
// 1. SCHEMAS
// ==========================================
const farmerSchema = new mongoose.Schema({
    name: String,
    phoneNo: String,
    landArea: Number, 
    location: { 
        state: String, 
        district: String 
    },
    caste: { type: String, enum: ['General', 'OBC', 'SC', 'ST'] },
    annualIncome: Number,
    deviceType: { type: String, enum: ['smartphone', 'keypad'] },
});

const schemeSchema = new mongoose.Schema({
    name: String,
    description: String,
    benefits: String,
    requiredDocuments: [String],
    applyLink: String,
    cscCharges: Number,
    deadline: Date,
    priorityScore: Number,
    // REAL WORLD FILTERS
    eligibility: {
        maxIncome: Number,
        allowedCastes: [String], // ["All"] or ["OBC", "SC"]
        targetStates: [String],  // ["All"] or ["Uttar Pradesh"]
        minLand: Number,
        maxLand: Number
    }
});

const Farmer = mongoose.model('Farmer', farmerSchema);
const Scheme = mongoose.model('Scheme', schemeSchema);

// ==========================================
// 2. DUMMY DATA SCRIPT
// ==========================================
async function seedDatabase() {
    try {
        await mongoose.connect('mongodb+srv://ravinits071:ravi7102@cursor.mevzabf.mongodb.net/krishi_sahayak');

        await Farmer.deleteMany({});
        await Scheme.deleteMany({});

        // --- REALISTIC SCHEMES ---
        await Scheme.insertMany([
            {
                name: "PM-KISAN Samman Nidhi",
                description: "Direct income support of ₹6,000 per year.",
                benefits: "₹2000 every 4 months.",
                requiredDocuments: ["Aadhar Card", "Bank Passbook", "Land Record"],
                applyLink: "https://pmkisan.gov.in/",
                cscCharges: 50,
                deadline: new Date('2026-12-31'),
                priorityScore: 10,
                eligibility: { maxIncome: 300000, allowedCastes: ["All"], targetStates: ["All"], minLand: 0, maxLand: 5 }
            },
            {
                name: "UP Kanya Sumangala (Farmer Special)",
                description: "Financial aid for daughters of UP farmers.",
                benefits: "₹15,000 total assistance.",
                requiredDocuments: ["Birth Certificate", "Income Certificate", "Ration Card"],
                applyLink: "https://mksy.up.gov.in/",
                cscCharges: 30,
                deadline: new Date('2025-12-01'),
                priorityScore: 7,
                eligibility: { maxIncome: 200000, allowedCastes: ["All"], targetStates: ["Uttar Pradesh"], minLand: 0, maxLand: 10 }
            },
            {
                name: "SC/ST Agriculture Subsidy",
                description: "Special equipment subsidy for SC/ST category farmers.",
                benefits: "90% subsidy on tractors and tools.",
                requiredDocuments: ["Caste Certificate", "Aadhar", "Land Proof"],
                applyLink: "https://agrimachinery.nic.in/",
                cscCharges: 0,
                deadline: new Date('2026-06-30'),
                priorityScore: 9,
                eligibility: { maxIncome: 500000, allowedCastes: ["OBC","SC", "ST"], targetStates: ["All"], minLand: 0, maxLand: 20 }
            }
        ]);

        // --- DIVERSE FARMERS ---
        await Farmer.insertMany([
            {
                name: "Hemendra Kumar",
                phoneNo: "6306987012",
                landArea: 3.2,
                location: { state: "Uttar Pradesh", district: "Lucknow" },
                caste: "General",
                annualIncome: 180000,
                deviceType: "smartphone",
            },
            {
                name: "Ramesh Kumar",
                phoneNo: "9955813612",
                landArea: 1.5,
                location: { state: "Uttar Pradesh", district: "Varanasi" },
                caste: "OBC",
                annualIncome: 150000,
                deviceType: "smartphone",
            },
            {
                // Is kisaan ko sirf SC/ST wali scheme dikhegi
                name: "Suresh Patil",
                phoneNo: "8765432109",
                landArea: 0.8,
                location: { state: "Maharashtra", district: "Pune" },
                caste: "SC",
                annualIncome: 90000,
                deviceType: "keypad",
            }
        ]);

        console.log("✅ Dynamic Data Seeded Successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
  }
}

//seedDatabase();

module.exports = { Farmer, Scheme };