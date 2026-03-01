import { PRIORITY } from './models';

export class ScoringEngine {
  constructor() {
    this.weights = {
      price: 0.30,        // 30% - Price below ARV
      motivation: 0.25,    // 25% - Seller motivation signals
      source: 0.20,        // 20% - Source reliability
      location: 0.15,      // 15% - Market strength
      condition: 0.10      // 10% - Property condition
    };
  }

  scoreDeal(deal) {
    let score = 0;
    const factors = [];

    // 1. Price Score (based on 70% rule)
    if (deal.estimatedArv && deal.askingPrice && deal.estimatedRepairs) {
      const maxOffer = deal.estimatedArv * 0.7 - deal.estimatedRepairs;
      const discount = (maxOffer - deal.askingPrice) / maxOffer;
      
      const priceScore = Math.min(100, Math.max(0, 50 + (discount * 100)));
      score += priceScore * this.weights.price;
      
      factors.push({
        name: 'Price vs ARV',
        score: priceScore,
        weight: this.weights.price,
        contribution: priceScore * this.weights.price,
        detail: `Max offer: $${Math.round(maxOffer).toLocaleString()}, Asking: $${deal.askingPrice.toLocaleString()}`
      });
      
      // Auto-calculate useful metrics
      deal.maxOffer = Math.round(maxOffer);
      deal.estimatedProfit = Math.round(deal.estimatedArv - deal.askingPrice - deal.estimatedRepairs - 26900);
      deal.estimatedRoi = Math.round((deal.estimatedProfit / deal.askingPrice) * 100);
      deal.isGoodDeal = deal.estimatedProfit > 30000 && maxOffer > deal.askingPrice;
    }

    // 2. Motivation Score
    let motivationScore = 50; // Base score
    
    if (deal.sourceType === 'expired_mls') {
      motivationScore += 20;
      factors.push({ name: 'Expired Listing', score: 20, weight: 0, contribution: 20 });
    }
    
    if (deal.sourceType === 'tax_delinquent') {
      motivationScore += 30;
      factors.push({ name: 'Tax Delinquent', score: 30, weight: 0, contribution: 30 });
    }
    
    if (deal.sourceType === 'probate') {
      motivationScore += 40;
      factors.push({ name: 'Probate', score: 40, weight: 0, contribution: 40 });
    }
    
    if (deal.notes?.toLowerCase().includes('motivated')) {
      motivationScore += 15;
    }
    
    if (deal.notes?.toLowerCase().includes('vacant')) {
      motivationScore += 10;
    }
    
    score += motivationScore * this.weights.motivation;

    // 3. Source Reliability Score
    let sourceScore = 50;
    
    const sourceReliability = {
      'wholesaler': 80,
      'agent': 75,
      'expired_mls': 70,
      'manual': 50,
      'social': 40
    };
    
    sourceScore = sourceReliability[deal.sourceType] || 50;
    score += sourceScore * this.weights.source;
    
    factors.push({
      name: 'Source Reliability',
      score: sourceScore,
      weight: this.weights.source,
      contribution: sourceScore * this.weights.source
    });

    // Determine priority based on final score
    const finalScore = Math.min(100, Math.max(0, Math.round(score)));
    
    let priority = PRIORITY.COLD;
    if (finalScore >= 75) priority = PRIORITY.HOT;
    else if (finalScore >= 50) priority = PRIORITY.WARM;
    
    return {
      score: finalScore,
      priority,
      factors,
      isGoodDeal: deal.isGoodDeal,
      summary: this.generateSummary(finalScore, deal)
    };
  }

  generateSummary(score, deal) {
    if (score >= 75) {
      return `🔥 HOT LEAD: ${deal.address || 'Property'} scores ${score} - Contact immediately!`;
    } else if (score >= 50) {
      return `👍 WARM LEAD: ${deal.address || 'Property'} scores ${score} - Follow up this week.`;
    } else {
      return `👎 COLD LEAD: ${deal.address || 'Property'} scores ${score} - Monitor, but don't prioritize.`;
    }
  }
}