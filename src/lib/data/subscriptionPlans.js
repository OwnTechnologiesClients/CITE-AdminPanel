// Static subscription plans data
// This will be replaced with dynamic data from the backend in the future

export const SUBSCRIPTION_PLANS = {
  parents_kids: [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 9.99,
      currency: 'USD',
      duration: 'monthly',
      features: [
        'Access to basic parenting resources',
        'Up to 2 kids profiles',
        'Basic activity tracking',
        'Email support'
      ],
      maxKids: 2,
      maxActivities: 10
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 19.99,
      currency: 'USD',
      duration: 'monthly',
      features: [
        'All basic features',
        'Unlimited kids profiles',
        'Advanced activity tracking',
        'Reward system',
        'Priority support',
        'Custom goals'
      ],
      maxKids: -1, // unlimited
      maxActivities: -1 // unlimited
    },
    {
      id: 'family',
      name: 'Family Plan',
      price: 29.99,
      currency: 'USD',
      duration: 'monthly',
      features: [
        'All premium features',
        'Family dashboard',
        'Shared goals and rewards',
        'Family calendar',
        '24/7 support',
        'Advanced analytics'
      ],
      maxKids: -1,
      maxActivities: -1
    }
  ],
  adults: [
    {
      id: 'starter',
      name: 'Starter Plan',
      price: 7.99,
      currency: 'USD',
      duration: 'monthly',
      features: [
        'Basic habit tracking',
        'Up to 5 habits',
        'Simple goal setting',
        'Email support'
      ],
      maxHabits: 5,
      maxReflections: 10
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: 14.99,
      currency: 'USD',
      duration: 'monthly',
      features: [
        'All starter features',
        'Unlimited habits',
        'Advanced analytics',
        'Habit streaks',
        'Priority support',
        'Custom reminders'
      ],
      maxHabits: -1,
      maxReflections: -1
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 24.99,
      currency: 'USD',
      duration: 'monthly',
      features: [
        'All pro features',
        'Team collaboration',
        'Advanced reporting',
        'API access',
        'Dedicated support',
        'Custom integrations'
      ],
      maxHabits: -1,
      maxReflections: -1
    }
  ],
  together: [
    {
      id: 'standard',
      name: 'Standard Plan',
      price: 12.99,
      currency: 'USD',
      duration: 'monthly',
      features: [
        'Family meal planning',
        'Recipe library access',
        'Shopping list sharing',
        'Basic meal tracking',
        'Email support'
      ],
      maxMeals: 30,
      maxRecipes: 100
    },
    {
      id: 'deluxe',
      name: 'Deluxe Plan',
      price: 22.99,
      currency: 'USD',
      duration: 'monthly',
      features: [
        'All standard features',
        'Unlimited meals',
        'Unlimited recipes',
        'Nutritional analysis',
        'Meal prep guides',
        'Priority support'
      ],
      maxMeals: -1,
      maxRecipes: -1
    },
    {
      id: 'ultimate',
      name: 'Ultimate Plan',
      price: 34.99,
      currency: 'USD',
      duration: 'monthly',
      features: [
        'All deluxe features',
        'Personalized meal plans',
        'Dietitian consultations',
        'Custom recipe creation',
        '24/7 support',
        'Advanced meal analytics'
      ],
      maxMeals: -1,
      maxRecipes: -1
    }
  ]
};

// Get all plans for a module
export function getPlansForModule(moduleName) {
  return SUBSCRIPTION_PLANS[moduleName] || [];
}

// Get a specific plan by ID
export function getPlanById(moduleName, planId) {
  const plans = getPlansForModule(moduleName);
  return plans.find(plan => plan.id === planId) || null;
}

// Get default plan for a module (usually the first one)
export function getDefaultPlan(moduleName) {
  const plans = getPlansForModule(moduleName);
  return plans[0] || null;
}

