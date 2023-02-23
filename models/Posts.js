module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define('Posts', {
    //table
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  Posts.associate = (models) => {
    Posts.hasMany(models.Comments, {
      //each post might have multiple comments
      onDelete: 'cascade', //delete every single post
    });
    Posts.hasMany(models.Likes, {
      //each post might have multiple comments
      onDelete: 'cascade', //delete every single post
    });
  };

  return Posts;
};
