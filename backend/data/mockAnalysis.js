export const sampleScenarios = [
  {
    id: "handpump-water",
    title: "Broken public handpump",
    keywords: ["handpump", "pump", "water", "drinking water", "well", "tube well", "tap"],
    category: "Water Management",
    severity: "High",
    requiredExpertise: [
      "Water Resources",
      "Mechanical Engineering",
      "IoT",
      "Rural Infrastructure"
    ],
    possibleSolutions: [
      "Mechanical cylinder, leather bucket washer, and foot-valve replacement",
      "Retrofitting with solar-powered low-maintenance submersible pumping unit",
      "IoT pressure & acoustic sensor node for real-time operational status alerts",
      "Community groundwater recharge soak-pit and filtration basin"
    ],
    suggestedRankings: [
      {
        institutionId: "nit-jsr",
        matchPercentage: 94,
        rationale: [
          "Strong Water Resources expertise and dedicated Fluid Mechanics laboratory",
          "Relevant Mechanical Engineering department with pump & valve testing facility",
          "Active research in low-cost rural infrastructure and field deployment in Jharkhand"
        ]
      },
      {
        institutionId: "bit-mesra",
        matchPercentage: 88,
        rationale: [
          "Extensive groundwater mapping and remote sensing research groups",
          "Mechanical durability and community infrastructure expertise",
          "Proximity to regional rural development initiatives in Ranchi & tribal belts"
        ]
      },
      {
        institutionId: "iit-kgp",
        matchPercentage: 85,
        rationale: [
          "School of Water Resources with specialized aquifer and pumping design teams",
          "RuTAG (Rural Technology Action Group) with proven low-cost mechanical solutions",
          "Robust faculty mentorship and student innovators for community hardware"
        ]
      },
      {
        institutionId: "iit-dhanbad",
        matchPercentage: 81,
        rationale: [
          "Specialized Hydrogeology & Aquifer Characterization research",
          "Heavy steel hardware fatigue analysis and corrosion prevention"
        ]
      }
    ]
  },
  {
    id: "urban-drainage",
    title: "Clogged storm drainage & monsoon waterlogging",
    keywords: ["drain", "drainage", "waterlogging", "sewage", "flood", "clogged", "overflow"],
    category: "Civil & Urban Infrastructure",
    severity: "Critical",
    requiredExpertise: [
      "Civil Engineering",
      "Hydrology & Stormwater Modeling",
      "IoT Sensor Networks",
      "Urban Planning"
    ],
    possibleSolutions: [
      "Autonomous mechanical desilting robotic auger for underground conduits",
      "IoT ultrasonic water level sensors with automated SMS alerts for municipal crews",
      "Permeable geopolymer pavers and sub-surface bio-retention swales",
      "GIS hydrological elevation modeling to redesign gravity flow gradients"
    ],
    suggestedRankings: [
      {
        institutionId: "iiest-shibpur",
        matchPercentage: 95,
        rationale: [
          "Pioneering research in urban waterlogging and stormwater drainage simulation",
          "Civil Engineering department with heavy municipal drainage consultation experience",
          "Water & Waste Engineering lab with active municipal pilot testbeds"
        ]
      },
      {
        institutionId: "iit-kgp",
        matchPercentage: 91,
        rationale: [
          "Leading Environmental Hydraulics laboratory and AI drainage network optimization",
          "Advanced GIS and remote sensing topographic elevation mapping"
        ]
      },
      {
        institutionId: "nit-jsr",
        matchPercentage: 84,
        rationale: [
          "Water Resources division specializing in open channel and culvert hydraulics",
          "Rapid prototyping IoT telemetry capabilities"
        ]
      },
      {
        institutionId: "bit-mesra",
        matchPercentage: 79,
        rationale: [
          "Remote Sensing department skilled in urban impervious surface mapping",
          "Civil & Environmental faculty experienced in regional civic works"
        ]
      }
    ]
  },
  {
    id: "solar-microgrid",
    title: "Damaged community solar streetlight & battery failure",
    keywords: ["solar", "streetlight", "light", "electricity", "battery", "power", "blackout", "wiring"],
    category: "Renewable Energy & Power Systems",
    severity: "Medium",
    requiredExpertise: [
      "Electrical & Electronics",
      "Photovoltaics & Power Electronics",
      "Battery Energy Storage Systems",
      "IoT Remote Monitoring"
    ],
    possibleSolutions: [
      "Replacement of degraded lead-acid cell with rugged LiFePO4 battery pack with thermal regulation",
      "MPPT charge controller refurbishment with anti-theft and overload protection",
      "LoRaWAN-enabled remote telemetry node to alert technicians before total power failure",
      "Micro-inverter inspection and anti-soiling hydrophobic coating for PV panels"
    ],
    suggestedRankings: [
      {
        institutionId: "nit-rourkela",
        matchPercentage: 93,
        rationale: [
          "Premier Centre for Clean Energy & Rural Engineering with off-grid microgrid testbeds",
          "Deep expertise in solar PV power conditioning and battery lifecycle optimization",
          "High student hackathon & incubation support for field-deployable solar kits"
        ]
      },
      {
        institutionId: "bit-mesra",
        matchPercentage: 89,
        rationale: [
          "Alternative Energy & Mechanical Testing facility with active solar PV grants",
          "Electrical & Electronics faculty focused on low-voltage DC microgrids"
        ]
      },
      {
        institutionId: "nit-jsr",
        matchPercentage: 83,
        rationale: [
          "Electrical Engineering department with renewable energy microgrid testbed",
          "IoT sensor integration lab for remote infrastructure diagnostics"
        ]
      }
    ]
  },
  {
    id: "pothole-road",
    title: "Severe asphalt pothole cluster & road erosion",
    keywords: ["pothole", "road", "asphalt", "accident", "erosion", "crater", "highway", "traffic"],
    category: "Transportation & Civil Infrastructure",
    severity: "High",
    requiredExpertise: [
      "Civil Engineering (Pavement)",
      "Material Science",
      "Computer Vision",
      "Geotechnical Engineering"
    ],
    possibleSolutions: [
      "Cold-mix asphalt patch using industrial waste fly-ash geopolymer binder",
      "Mobile smartphone-based computer vision pothole depth mapping for municipal priority",
      "Sub-base drainage perforated French drains to stop monsoon water erosion",
      "Fiber-reinforced polymer grid reinforcement beneath the wearing course"
    ],
    suggestedRankings: [
      {
        institutionId: "iit-dhanbad",
        matchPercentage: 92,
        rationale: [
          "Leading Geotechnical and Civil Engineering testing facilities for road subgrades",
          "Pavement materials laboratory specializing in high-stress road surfacing"
        ]
      },
      {
        institutionId: "nit-jsr",
        matchPercentage: 87,
        rationale: [
          "Civil Engineering department with concrete & highway materials testing lab",
          "Active collaborations with regional state road development authorities"
        ]
      },
      {
        institutionId: "iit-kgp",
        matchPercentage: 86,
        rationale: [
          "Extensive research in asphalt polymer modification and AI pavement inspection",
          "Structural durability testing under extreme heavy-vehicle loads"
        ]
      }
    ]
  }
];

export function generateDynamicMockAnalysis({ description = "", location = "", imagePresent = false }) {
  const text = (description + " " + location).toLowerCase();

  // Find matching preset scenario
  for (const scenario of sampleScenarios) {
    if (scenario.keywords.some((kw) => text.includes(kw))) {
      return {
        detectedProblem: scenario.title,
        category: scenario.category,
        severity: scenario.severity,
        requiredExpertise: scenario.requiredExpertise,
        possibleSolutions: scenario.possibleSolutions,
        suggestedRankings: scenario.suggestedRankings,
        isDynamic: false
      };
    }
  }

  // Fallback dynamic analysis if user entered custom text
  const words = description.trim().split(/\s+/);
  const detectedProblem = words.length > 2
    ? description.charAt(0).toUpperCase() + description.slice(1).split(/[.!?\n]/)[0]
    : "Unspecified Community Infrastructure Issue";

  return {
    detectedProblem: detectedProblem || "Civic Infrastructure Degradation",
    category: "Civil & Environmental Engineering",
    severity: "High",
    requiredExpertise: [
      "Civil Engineering",
      "Mechanical Engineering",
      "IoT Monitoring",
      "Rural Infrastructure"
    ],
    possibleSolutions: [
      "Physical structural rehabilitation and hardware stabilization",
      "Sensor-based remote condition monitoring to prevent recurrence",
      "Rapid municipal notification and civic action dispatch",
      "Community maintenance and local technician training workshop"
    ],
    suggestedRankings: [
      {
        institutionId: "nit-jsr",
        matchPercentage: 92,
        rationale: [
          "Strong core engineering departments (Civil & Mechanical) capable of field diagnosis",
          "Dedicated Rural Infrastructure Technology cell for grassroots deployment",
          "Close proximity for site visits and prototype deployment"
        ]
      },
      {
        institutionId: "bit-mesra",
        matchPercentage: 86,
        rationale: [
          "Broad interdisciplinary engineering research and testing laboratories",
          "Demonstrated community outreach and regional field consultancy"
        ]
      },
      {
        institutionId: "iit-kgp",
        matchPercentage: 84,
        rationale: [
          "World-class research infrastructure and RuTAG grassroots technology center",
          "Deep patent portfolio across environmental and civil equipment"
        ]
      }
    ],
    isDynamic: true
  };
}
