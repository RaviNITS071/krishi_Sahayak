const Farmer = require('../models/Farmer');
const Scheme = require('../models/Scheme');

exports.getSchemes = async (req, res) => {
  const { phoneNo } = req.params;

  const farmer = await Farmer.findOne({ phoneNo });
  const schemes = await Scheme.find();

  const filtered = schemes.filter(s => {
    const e = s.eligibility;

    return (
      farmer.annualIncome <= e.maxIncome &&
      (e.allowedCastes.includes("All") || e.allowedCastes.includes(farmer.caste)) &&
      (e.targetStates.includes("All") || e.targetStates.includes(farmer.location.state)) &&
      farmer.landArea >= e.minLand &&
      farmer.landArea <= e.maxLand
    );
  });

  res.json({ success: true, schemes: filtered });
};