-- Checks table (ScreeningStep)
CREATE TABLE IF NOT EXISTS "Checks" (
    "id" SERIAL PRIMARY KEY,
    "propertyId" INTEGER NOT NULL REFERENCES "House"("id") ON DELETE CASCADE,
    "ownership" BOOLEAN DEFAULT FALSE,
    "title" BOOLEAN DEFAULT FALSE,
    "zoning" BOOLEAN DEFAULT FALSE,
    "mortgage" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analysis table (AnalysisStep)
CREATE TABLE IF NOT EXISTS "Analysis" (
    "id" SERIAL PRIMARY KEY,
    "propertyId" INTEGER NOT NULL REFERENCES "House"("id") ON DELETE CASCADE,
    "roof" FLOAT,
    "kitchen" FLOAT,
    "flooring" FLOAT,
    "taxes" FLOAT,
    "insurance" FLOAT,
    "utilities" FLOAT,
    "interest" FLOAT,
    "months" INTEGER,
    "marketRisk" INTEGER DEFAULT 50,
    "liquidityRisk" INTEGER DEFAULT 50,
    "timelineRisk" INTEGER DEFAULT 50,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Decision table (DecisionStep)
CREATE TABLE IF NOT EXISTS "Decision" (
    "id" SERIAL PRIMARY KEY,
    "propertyId" INTEGER NOT NULL REFERENCES "House"("id") ON DELETE CASCADE,
    "funding" VARCHAR(50) DEFAULT 'cash',
    "lender" VARCHAR(255),
    "title" BOOLEAN DEFAULT FALSE,
    "insurance" BOOLEAN DEFAULT FALSE,
    "exit" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Offer table (AcquisitionStep)
CREATE TABLE IF NOT EXISTS "Offer" (
    "id" SERIAL PRIMARY KEY,
    "propertyId" INTEGER NOT NULL REFERENCES "House"("id") ON DELETE CASCADE,
    "offer_amount" FLOAT,
    "status" VARCHAR(50) DEFAULT 'submitted', -- submitted, accepted, rejected
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);