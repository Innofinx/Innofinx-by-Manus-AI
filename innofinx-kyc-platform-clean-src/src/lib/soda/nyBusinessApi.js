import axios from 'axios';

const API_ENDPOINT = 'https://data.ny.gov/resource/n9v6-gdp6.json';

export async function checkBusinessNameAvailability(businessName) {
  try {
    // SODA API uses SoQL for filtering. We'll filter by 'entity_name'
    // Using $where clause for filtering and $limit for demonstration
    const response = await axios.get(API_ENDPOINT, {
      params: {
        $where: `upper(entity_name) = upper('${businessName.replace(/'/g, "''")}')`,
        $limit: 1 // We only need to know if at least one match exists
      }
    });

    // If the response data array is not empty, it means the name is taken
    return response.data.length > 0;
  } catch (error) {
    console.error('Error checking business name availability:', error);
    // In case of an error, assume the name is available to avoid blocking
    // a legitimate business, but log the error for investigation.
    return false;
  }
}


