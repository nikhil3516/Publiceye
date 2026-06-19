import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { classifyComplaint } from '../../src/services/aiClassifier.ts';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'input.json');
if (!fs.existsSync(inputPath)) {
  console.error(`❌ Error: input.json not found at ${inputPath}`);
  process.exit(1);
}

// Load existing test cases
const originalCases = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
console.log(`📋 Loaded ${originalCases.length} original test cases from input.json.`);

const targetTotal = 200;
const neededCount = targetTotal - originalCases.length;

if (neededCount <= 0) {
  console.log(`✅ Already have ${originalCases.length} test cases. No generation needed.`);
  process.exit(0);
}

// Sentence templates for each category
const templates = {
  garbage: [
    "A pile of garbage is lying near the {loc}, attracting pests.",
    "The trash bin in {loc} is overflowing and needs sweeping and cleaning.",
    "People are dumping waste on the side of {loc}, creating a dirty environment.",
    "Litter is scattered all over {loc}, causing a foul smell.",
    "Uncleaned plastic dump near {loc} is causing a nuisance.",
    "The garbage collection truck did not visit {loc} this week.",
    "Piles of refuse and litter are scattered around the entrance of {loc}."
  ],
  pothole: [
    "There is a deep pothole in the middle of {loc}, causing traffic delay.",
    "A large road damage crater has formed near {loc}, causing vehicles to swerve.",
    "The road surface near {loc} is extremely uneven with multiple depressions.",
    "A dangerous pit has opened up on {loc} after the heavy rain.",
    "Drivers are complaining about the broken road and crater on {loc}.",
    "Deep road depression near {loc} is hazardous for motorbikes.",
    "Car tires are getting damaged due to the massive road crater at {loc}."
  ],
  streetlight: [
    "The streetlight near {loc} is broken and not working.",
    "It is completely dark around {loc} because the street light bulb is missing.",
    "A streetlight lamp is blinking constantly near {loc}, causing annoyance.",
    "The illumination at the junction of {loc} is poor due to damaged lights.",
    "The public street light pole near {loc} has no bulb.",
    "No functioning streetlight at {loc}, making it unsafe at night.",
    "Multiple street lamps are burnt out along the footpath of {loc}."
  ],
  water_supply: [
    "There is a major water pipeline leakage near {loc}, wasting clean drinking water.",
    "The water tap in {loc} is leaking continuously.",
    "We are facing a severe water shortage in {loc} for the past three days.",
    "The municipal water supply in {loc} appears contaminated with mud.",
    "Water is gushing out from a broken main supply line near {loc}.",
    "Water contamination reported in the storage tanks at {loc}.",
    "No water pressure in the municipal connection of {loc}."
  ],
  drainage: [
    "Raw sewage is overflowing from the sewer line near {loc}.",
    "A blocked drain is causing waterlogging and flooding on {loc}.",
    "The drainage system at {loc} is completely choked with plastic waste.",
    "Sewage water is backing up into the houses near {loc}.",
    "An open sewer drain in {loc} is emitting a terrible stink.",
    "Wastewater flooding near {loc} has turned the street into a swamp.",
    "Overflowing drainage water is flooding the basement around {loc}."
  ],
  roads: [
    "The lane divider paint has faded and traffic signals are blinking yellow on {loc}.",
    "Illegal encroachment by shopkeepers on the footpath has blocked pedestrian movement on {loc}.",
    "The pavement tiles near {loc} are broken and loose.",
    "Traffic congestion is severe at the crossroad of {loc} due to faulty signals.",
    "Broken road divider near {loc} is causing confusion.",
    "Sidewalk tiles are missing near {loc}, forcing pedestrians onto the road.",
    "Heavy vehicle encroachment on the pavement near {loc} is causing blockages."
  ],
  public_safety: [
    "A dangerous sparking electrical box near {loc} represents a fire hazard.",
    "An unsafe building wall shows signs of immediate collapse near {loc}.",
    "A live wire is hanging low from the electrical post over {loc}.",
    "There is a high risk of accident near {loc} due to loose overhead cables.",
    "An open electrical transformer near {loc} is sparking.",
    "Criminal activity and vandalism reported at the park near {loc}.",
    "Emergency situation near {loc} due to structural collapse."
  ],
  others: [
    "Stray cattle are sitting on the road near {loc}, slowing traffic.",
    "Unauthorised posters are pasted all over the walls of {loc}.",
    "Local park benches are broken in {loc}, needs repair.",
    "Noise pollution from loudspeakers near {loc} late at night.",
    "Stray dogs are roaming in packs and barking around {loc}.",
    "Some issues with the landscaping in the common garden of {loc}.",
    "Graffiti and defacement on public property near {loc}."
  ]
};

// Locations list to mix and match
const locations = [
  "Main Street", "Sector 4 Market", "Lane 5 Residential Area", "the local park",
  "the school crossroad", "Metro Station Exit", "Bus Stop junction", "Sector 7 Block B",
  "High School road", "the municipal hospital lane", "Sector 10 Colony", "Temple road",
  "Railway Station approach", "the community center", "the public playground", "Lane 12 crossing",
  "Sector 3 main road", "Commercial street", "the botanical garden entrance", "Subway passage",
  "Sector 9 Plaza", "the sports complex entrance", "Market Road", "Lane 2 intersection"
];

// Severity modifiers to mix in containing appropriate keywords
const severityModifiers = {
  critical: [
    " This is an urgent emergency. Extreme hazard and immediate risk of injury!",
    " Highly dangerous situation with a high risk of collapse and fire accident.",
    " Live wire sparking nearby, posing an unsafe fire hazard.",
    " Blocked road and sewage flooding has created an emergency health hazard.",
    " Unsafe structural condition showing immediate signs of collapse."
  ],
  high: [
    " This is urgent and needs attention to prevent an accident.",
    " The road is blocked and causing a major hazard.",
    " The overflow is causing a dangerous situation.",
    " Emergency repair is requested for this critical issue.",
    " The low hanging wires present a severe hazard."
  ],
  medium: [
    " The damaged section is causing a delay and needs repair.",
    " It has been broken and pending action for a week.",
    " A leaking pipe is causing a minor stink and smell.",
    " The missing cover is causing a pest problem.",
    " We are facing a delay in addressing this broken issue."
  ],
  low: [
    " It's a minor issue that needs routine maintenance.",
    " Please schedule a routine cleaning at your convenience.",
    " A simple check is required for this case.",
    " Regular sweeping would resolve this issue.",
    " No immediate threat, but needs monitoring."
  ]
};

const categories = Object.keys(templates);
const severities = Object.keys(severityModifiers);

const newCases = [];
let idCounter = originalCases.length + 1;
let loopIdx = 0;

console.log(`⚙️ Generating ${neededCount} new test cases...`);

while (newCases.length < neededCount) {
  const cat = categories[loopIdx % categories.length];
  const sev = severities[Math.floor(loopIdx / categories.length) % severities.length];
  
  const templateList = templates[cat];
  const template = templateList[loopIdx % templateList.length];
  const loc = locations[loopIdx % locations.length];
  
  const modifierList = severityModifiers[sev];
  const modifier = modifierList[loopIdx % modifierList.length];
  
  const desc = template.replace("{loc}", loc) + modifier;
  
  // Classify with the categoryHint to mimic input.js behavior
  const result = classifyComplaint(desc, cat);
  
  const tc = {
    id: `TC-${String(idCounter).padStart(3, '0')}`,
    description: desc,
    categoryHint: cat,
    expectedCategory: result.category,
    expectedSeverity: result.severity,
    expectedOfficer: result.assignedOfficer.name,
    expectedSla: result.slaHours
  };
  
  newCases.push(tc);
  idCounter++;
  loopIdx++;
}

const finalCases = [...originalCases, ...newCases];

fs.writeFileSync(inputPath, JSON.stringify(finalCases, null, 2), 'utf-8');
console.log(`✅ Successfully generated ${newCases.length} cases.`);
console.log(`📝 Overwrote ${inputPath} with total of ${finalCases.length} test cases.`);
