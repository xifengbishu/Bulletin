'sdfopen ./uwnd.10m.mon.mean.nc'
'sdfopen ./vwnd.10m.mon.mean.nc'
  lon_domain='lon 100 150'
  lat_domain='lat 0 50'
'set 'lon_domain
'set 'lat_domain
'set gxout vector'
'set arrowhead 0.1'
'd uwnd;vwnd.2'
