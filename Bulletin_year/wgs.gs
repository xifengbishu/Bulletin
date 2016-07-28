'reinit'
'sdfopen uwnd.10m.mon.mean.nc'

lon_domain='lon 100 135'
lat_domain='lat 18 50'
  z_domain='z 1 23'
     t_beg=1
     t_end=1
     title='hdivg'
     plot_nice=1
***************************************************************************
*********************the loop of time**************************************
t=t_beg
*'set vpage 0.2 8.5 0 11'
*'set parea 0.4 8 0.4 10.5'
while(t<=t_end)

* --- output name
  outname = title'_t_'t

*

'set 'lon_domain
'set 'lat_domain
'set t 't
'set grads off'
'set grid off'
*'set clab forced'
'set font 5'
'set xlint 5'
'set ylint 5'
'set xlopts 1 6 0.15'
'set ylopts 1 6 0.15'
'set clopts 1 6 0.15'
'set map 1 1 6'
'set strsiz 0.25'
'set mpdset mres'
*'cnbasemap'
'draw map'
'set map 5'
'set mpdset cnriver'
'draw map'
***************************************************************************
'set black -100 100'
'set cthick 6'
'd uwnd'
*********************************@@@time@@@********************************
'q time'
b=subwrd(result,3)
hour=substr(b,1,2)
day=substr(b,4,2)
month=substr(b,6,3)
year=substr(b,9,4)
datatime=hour%'UTC '%day%month%' '%year
********************************@@@print@@@*******************************

*'draw title 'title'_t='datatime
*'cbar'

  'enable print ./'outname'.gm'
  'print'
  'disable print'

* --- convert gm to eps 
  '! gxeps -R -c -i 'outname'.gm -o 'outname'.eps'
  '! rm -f 'outname'.gm'
if ( plot_nice = 0 )
* --- convert eps to gif 
  '! convert -density 144 -antialias -trim 'outname'.eps 'outname'.bmp'
  '! convert -density 144 -antialias -trim 'outname'.bmp 'outname'.jpg'
else
* --- imagick software needed
  '! convert -density 1200 -resize 25% -trim 'outname'.eps tmp.jpg'
  '! convert -density 300  tmp.jpg 'outname'.jpg'
*  '! convert -resize 50% 'outname'.jpg 'outname'.gif'
  '! rm -f    tmp.jpg'
endif

  '! rm -f 'outname'.bmp'
  '! rm -f 'outname'.eps'
*  '! rm -f 'outname'.gif'
*********************************loop of time****************************
  t=t+1
  'c'
  endwhile
if ( t_beg < t_end ) 
  '!rm -rf 'title
  '!mkdir 'title
  '!mv 'title'*gif 'title
endif

  'reinit'
  'quit'
