// models/Movie.js
import sequelize from '../lib/db';
import { DataTypes } from 'sequelize';

const Movie = sequelize.define('Movie', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  poster: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Movie;
