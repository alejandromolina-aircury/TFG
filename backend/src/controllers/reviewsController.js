const axios = require('axios');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Obtener las últimas 5 reseñas de Google Places
 * GET /api/public/reviews
 */
exports.getGoogleReviews = asyncHandler(async (req, res) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  // Fallback a datos estáticos si no hay configuración
  if (!apiKey || !placeId) {
    return res.json({
      status: 'success',
      source: 'mock',
      data: [
        { 
          id: '1', 
          name: 'Marta García', 
          quote: 'La mejor paella que he probado en años. El servicio impecable y las vistas al mar son el complemento perfecto.', 
          rating: 5,
          relative_time_description: 'hace una semana',
          profile_photo_url: 'https://ui-avatars.com/api/?name=Marta+Garcia&background=random'
        },
        { 
          id: '2', 
          name: 'Juan Pérez', 
          quote: 'Un lugar con alma. El pulpo estaba en su punto exacto. Repetiremos sin duda.', 
          rating: 5,
          relative_time_description: 'hace 3 días',
          profile_photo_url: 'https://ui-avatars.com/api/?name=Juan+Perez&background=random'
        },
        { 
          id: '3', 
          name: 'Elena Rodríguez', 
          quote: 'Tradición y calidad. Se nota el cariño en cada plato. Muy recomendado para cenas románticas.', 
          rating: 5,
          relative_time_description: 'hace un mes',
          profile_photo_url: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=random'
        },
        { 
          id: '4', 
          name: 'Carlos Sánchez', 
          quote: 'Excelente trato y comida de diez. Las bravas son obligatorias.', 
          rating: 4,
          relative_time_description: 'hace 2 semanas',
          profile_photo_url: 'https://ui-avatars.com/api/?name=Carlos+Sanchez&background=random'
        },
        { 
          id: '5', 
          name: 'Sofía Martínez', 
          quote: 'La terraza es espectacular. Comida mediterránea auténtica en el corazón de Alicante.', 
          rating: 5,
          relative_time_description: 'hace 4 días',
          profile_photo_url: 'https://ui-avatars.com/api/?name=Sofia+Martinez&background=random'
        }
      ]
    });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&language=es`;
    const response = await axios.get(url);
    
    if (response.data.status !== 'OK') {
      throw new Error(`Google API Error: ${response.data.status} - ${response.data.error_message || ''}`);
    }

    const reviews = response.data.result?.reviews || [];
    
    const formattedReviews = reviews.map((rev, index) => ({
      id: `google-${index}`,
      name: rev.author_name,
      quote: rev.text,
      rating: rev.rating,
      profile_photo_url: rev.profile_photo_url,
      relative_time_description: rev.relative_time_description
    })).slice(0, 5);

    res.json({
      status: 'success',
      source: 'google',
      data: formattedReviews
    });
  } catch (error) {
    console.error('Error fetching Google reviews:', error.message);
    // En caso de error de la API, devolvemos el fallback para no romper el frontend
    res.json({
      status: 'success',
      source: 'fallback',
      data: [
        { 
          id: '1', 
          name: 'Marta García', 
          quote: 'La mejor paella que he probado en años. El servicio impecable y las vistas al mar son el complemento perfecto.', 
          rating: 5,
          relative_time_description: 'hace una semana',
          profile_photo_url: 'https://ui-avatars.com/api/?name=Marta+Garcia&background=random'
        },
        { 
          id: '2', 
          name: 'Juan Pérez', 
          quote: 'Un lugar con alma. El pulpo estaba en su punto exacto. Repetiremos sin duda.', 
          rating: 5,
          relative_time_description: 'hace 3 días',
          profile_photo_url: 'https://ui-avatars.com/api/?name=Juan+Perez&background=random'
        },
        { 
          id: '3', 
          name: 'Elena Rodríguez', 
          quote: 'Tradición y calidad. Se nota el cariño en cada plato. Muy recomendado para cenas románticas.', 
          rating: 5,
          relative_time_description: 'hace un mes',
          profile_photo_url: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=random'
        }
      ]
    });
  }
});
