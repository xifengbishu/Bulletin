'reinit'
'sdfopen ./uwnd.10m.mon.mean.nc'
'sdfopen ./vwnd.10m.mon.mean.nc'
plot_nice=0
lon_domain='lon 100 150'
lat_domain='lat 0 50'

*'enable print ./2013.awind.10.gmf'

i=1
while(i<=1)
'set 'lon_domain
'set 'lat_domain
'set grads off'
'set grid off'
'set mpdset hires'
'set map 1 1 6'
*'set clab forced'
'set font 5'
'set strsiz 0.25'
'set ccolor rainbow'

t1=324+i
*1975-1993year*
'define p1'i'=ave(uwnd,t='t1',t=552,12)'
'define p2'i'=ave(vwnd.2,t='t1',t=552,12)'

*2012.1*
t2=780+i
'define a1'i'=uwnd(t='t2')-p1'i''
'define a2'i'=vwnd.2(t='t2')-p2'i''

'set gxout vector'
*     --- shaded color 
      do_color_set ( 4 )
      'set clevs  '_nheight
      'set rbcols '_ncolor
'set arrscl 0.4 6'
'set xlpos -20'
'set ylpos -20'
'd a1'i';a2'i';mag(a1'i', a2'i')'
*'run axis.gs -type r -position o -sinterval 2 -suffix `3.`n -lfont 5 -lsize 0.08 -lthick 0.4'
*'run axis.gs -type b -position o -sinterval 2 -suffix `3.`n -lfont 5 -lsize 0.08 -lthick 0.4'
'run axis.gs -type b -position i -sinterval 2 -suffix a -lfont 5 -lsize 0.08 -lthick 0.4'
*'run axis.gs -type b -position o'
pull dummy
*'axis -type b -position o -sinterval 2 -suffix `3.`n -lfont 5 -lsize 0.08 -lthick 0.4'
*draw title AWIND in 'i' month'
*'cnbasemap '
'basemap l 15 1 M'
'run cbarn'
outname='year_'i

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
*  '! rm -f 'outname'.gig'
*********************************loop of time****************************

'c'
i=i+1
endwhile
'disable print' 
'reinit'
'quit'
function do_color_set(args)
  color_num = subwrd(args,1) 
* --- 4: blue and red ( for difference)
  if( color_num = 4 ) 
'set rgb 21 160 255 229'
'set rgb 22 104 242 233'
'set rgb 23 49 22g 235'
'set rgb 24 38 223 241'
'set rgb 25 26 216 241'
'set rgb 26 26 204 235'
'set rgb 27 27 184 223'
'set rgb 28 26 165 210'
'set rgb 29 29 139 196'
'set rgb 30 30 114 178'
'set rgb 31 26 103 164'
'set rgb 32 19 89 140'
'set rgb 33 23 49 110'
'set rgb 34 18 10 58'
    _ncolor = '  21   22   23  2g  25   26   27  28  29 30 31  32  33  34' 
    _nheight = '  0  0.2  0.4 0.6 0.8   1   1.2 1.4 1.6 1.8 2 2.2 2.4'
  endif
return
