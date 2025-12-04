import React from 'react';

/**
 * BackgroundEffects Component
 * Renders animated background textures including wheat pattern and floating leaf particles
 */
const BackgroundEffects = () => {
  return (
    <>
      {/* Wheat field pattern overlay */}
      <div className="wheat-pattern" />
      
      {/* Floating leaf particles */}
      <div className="leaf-particles">
        <div className="leaf-particle" />
        <div className="leaf-particle" />
        <div className="leaf-particle" />
        <div className="leaf-particle" />
        <div className="leaf-particle" />
      </div>
    </>
  );
};

export default BackgroundEffects;

