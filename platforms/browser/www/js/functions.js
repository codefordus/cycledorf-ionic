function getDistance(lat1, lon1, lat2, lon2) {
  //Quelle: http://www.movable-type.co.uk/scripts/latlong.html
  var R = 6371000; // metres
  var lat1_ = lat1 * (Math.PI / 180);
  var lat2_ = lat2 * (Math.PI / 180);
  var d_lat = (lat2 - lat1) * (Math.PI / 180);
  var d_lon = (lon2 - lon1) * (Math.PI / 180);

  var a = Math.sin(d_lat / 2) * Math.sin(d_lat / 2) +
          Math.cos(lat1_) * Math.cos(lat2_) *
          Math.sin(d_lon / 2) * Math.sin(d_lon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
