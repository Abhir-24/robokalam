import PropTypes from "prop-types";
import './App.css'

const Video = ({ embedId }) => (
  <div className="video-responsive">
    <iframe
      width="400"
      height="300"
      src={`https://www.youtube.com/embed/${embedId}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </div>
);

Video.propTypes = {
  embedId: PropTypes.string.isRequired
};

export default Video;
