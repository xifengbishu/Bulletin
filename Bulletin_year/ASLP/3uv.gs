* --- Open GrADS ctl files
* --- ctl name (numbers = y_num)
'sdfopen slp.mon.mean.nc'
*  'open p_d02_all_list.ctl '
*  'open typhoon_d02_no_ter.ctl '
* --- multiple cases or single case ?
* --- m: multiple ( default )
* --- s: single   ( should be declared explicitly! )
* --- "case_no = 4" means "open ../case4/*.ctl", for single only!
  case_type   = 's'
  case_no     = 1 
* --- For example, never use it unless you modify this script!
  my_own_plot = 0

* --- convert time from UTC to LST ?
* --- If the time is already LST, then no!
* --- UTC2LST = 1, yes ; 0, no
  UTC2LST = 1

* --- arrangement of page and pannels
* --- xy_ratio can be calculated aumomatically
* --- However, you can tune its value for your own aim
* ---
  page_type  = 'p'
  x_num      = 1
  y_num      = 1
  ratio_auto = 1
  plot_nice  = 0
* --- Normally, do not use it.
  if( ratio_auto = 0 )
    xy_ratio  = 1.20
  endif

* --- It is ok for normal use
* --- Normally, do not need to change it.
  if( page_type = 'p' ) 
    x_sta =  0.55
    x_end =  7.55
*    x_end =  7.55
    y_beg = 10.50
  endif
  if( page_type = 'l' ) 
    x_sta =  0.25
    x_end = 10.65
    y_beg =  8.30
  endif
 
* ---  reset_domain = 1 / 0
* ---  1: yes ; 0: no (default domain is used)
  reset_domain = 1
  lon_domain='lon 100 150'
  lat_domain='lat 0 50'
*  lon_domain   = 'lon 100 145'
*  lat_domain   = 'lat  20  55'

* --- draw labels of longitude and latitude along axises
* --- xlint_num =5 means an interval of 5 deg. along X-axis
  string_size  = 0.15
  xlint_num    = 5
  ylint_num    = 5
* 
* --- draw color bar ( 1: yes ; 0: no )
* --- size of color bar string at the bottom
* --- height of color bar
  color_bar    = 1
  bar_str_size = 0.12
  bar_height   = 0.16
  color_set    = 126

* --- wind vector/barb at 10m above sea level
* --- wind_plot ( 1: yes  ; 0: no )
* --- wind_type ( 1: barb ; 2: vector )
* --- full barb ( 4: 4m/s ; 5: 5m/s )
  wind_plot = 0
  wind_type = 1
* --- wind_type: barb
  if( wind_type = 1 ) 
    interval  = 20
    barb_size = 0.12
    full_barb = 4
  endif
* --- wind_type: vector
  if( wind_type = 2 )
    interval  = 2
    arrowhead = 0.05
*   --- arrow length: length
*   --- this length present the speed scale (m/s)
    length    = 0.5
    scale     = 4
  endif

* --- set number of output picture (pic_num)
* --- set case name
  pic_num   = 1
  case_name = 'hhhh9_d02_hcurl'
  var_unit  = ''
*  var_unit  = ' ms`a-1`n'
* --- force pic_num =1 when case_type='s'
  if( case_type = 's')
    pic_num = 1
  endif 

* --- time setting    ( tt = t_beg + (n-1)*t_int )
* --- begining times  ( t_beg )
* --- times interval  ( t_int )
* --- times can be given one by one (times_given=1)
* --- 1: give  ; 0: aumomatically calculated
* --- picture 1
    t_beg1 = 7
    t_int1 = 1
    times_given1 = 0
    times1 = ' 3 5 7 9 11 15'
* --- picture 2
    t_beg2 = 11
    t_int2 = 2
    times_given2 = 0
    times2 = ' 11 13 15 17 19 '

* --- along X direction
* --- title number
    title1 = ' a b c d e f g h i j k l m n o p '
    title2 = ' e f g h i j k l'
* --- along Y direction
* --- experiment case name 
  case = ' A B C D E F '

* --- Change size of the title of Date-time & panel number
* --- title_resize is between 1.0 and 1.3
* --- It is normally 1.0 
  title_resize = 1.00

* --- the panels below the first row can be without
* --- date-time titles, but with panel number only !
* --- 1: with ; 0: without 
  time_title = 0

* =======================================
* ---- End of Your Own Modifications ----
* ---- Do not touch anything below.  ----
* =======================================

* --- Big Loop
 page_num = 1
 while( page_num <= pic_num )
* --- set page infomation
   if( page_num = 1 )
     t_beg = t_beg1       
     t_int = t_int1
     title = title1
     times = times1
     times_given = times_given1
   endif
   if( page_num = 2 )
     t_beg = t_beg2       
     t_int = t_int2
     title = title2
     times = times2
     times_given = times_given2
   endif
    'set 'lon_domain
    'set 'lat_domain
say 'times_given  'times_given
ss=t_beg1
t1=324+ss
t11=324+ss+1
*1975-1993year*
'define p1'ss'=ave(slp,t='t1',t=552,12)'
'define p11'ss'=ave(slp,t='t11',t=552,12)'

t2=780+ss
t22=780+ss+1
'define a1'ss'=slp(t='t2')-p1'ss''
'define a11'ss'=slp(t='t22')-p11'ss''
*2012.1*

*
* ---- Step 0: check input
*
  'q gxinfo'
  rec  = sublin(result,2)
  xsiz = subwrd(rec,4)
  ysiz = subwrd(rec,6)
  if( xsiz = 8.5 & page_type = 'l' )
    say ' ======================================= '
    say ' '
    say ' Please grads -blc plot_fogtop_wrf.gs !  '
    say ' '
    say ' ======================================= '
    quit
  endif
  if( xsiz = 11 & page_type = 'p' )
    say ' ======================================= '
    say ' '
    say ' Please grads -bpc plot_fogtop_wrf.gs !  '
    say ' '
    say ' ======================================= '
    quit
  endif

*
* ---- Step 0: calculate xy_ratio 
* ----         longitude and latitude
  if( reset_domain = 1 )
    'set 'lon_domain
    'set 'lat_domain
  endif
  if( ratio_auto = 1 ) 
    'display lon'
    'query gxinfo'
    line3=sublin(result,3)
    line4=sublin(result,4)
    tmpa=subwrd(line3,4)
    tmpb=subwrd(line3,6)
    tmpc=subwrd(line4,4)
    tmpd=subwrd(line4,6)
    xy_ratio=(tmpd-tmpc)/(tmpb-tmpa)
    say ' The default xy_ration = 'xy_ratio
    'clear'
  endif
* ---- longitude and latitude
  'q dims'
  lined2 = sublin( result, 2)
  lined3 = sublin( result, 3)
  xlon1 = subwrd(lined2, 6)
  xlon2 = subwrd(lined2, 8)
  ylat1 = subwrd(lined3, 6)
  ylat2 = subwrd(lined3, 8)

*
* ---- Step 1: define page settings for all panels
*
  x_int = ( x_end - x_sta ) / x_num
  y_int = xy_ratio * x_int
  y_sta = y_beg - y_num*y_int
  'set vpage 0 'x_int' 0 'y_int''
*  x_v = subwrd(result,5) - 0.15
  x_v = subwrd(result,5) - 0.01
  y_v = subwrd(result,6) - 0.01
* ----------
  x  = x_sta
  m  = 1
  while( m <= x_num )
    y = y_beg - y_int
    n = 1
    while( n <= y_num )
      _vpage.m.n = ' set vpage 'x' 'x+x_int' 'y' 'y+y_int
      _parea.m.n = ' set parea 0 'x_v' 0 'y_v
*     --- for later use ---
      no = ( n - 1 ) * x_num + m      
      _vpg.no = ' set vpage 'x' 'x+x_int' 'y' 'y+y_int
      _par.no = ' set parea 0 'x_v' 0 'y_v
*     --------------------- 
      y = y - y_int
      n = n + 1
    endwhile
    x  =  x + x_int
    m  =  m + 1
  endwhile

*
* ---- Step 2: start to plot panel one by one
*
* === For your own case !
*     from left to right, from up to down
*     1   2  3
*     4   5  6
*     7   8  9
*
 if( my_own_plot = 1 )
   n = 1
   while( n <= y_num )
    m = 1
    while( m <= x_num )
*     --- start to plot panels one by one
      number = ( n - 1 ) * x_num + m  
      _vpg.number      
      _par.number
*     --- control panels one by one
      if( number = 1 )

      endif
      if( number = 2 )

      endif
      if( number = 3 )

      endif
      add_frame()
      'set vpage off '
      'set parea off '
      m = m + 1
    endwhile
    n = n + 1
   endwhile
 endif
*
* === For Sea Fog (WRF/RAMS) USE only below !
* 
  tt = t_beg
  m  = 1       
  while( m <= x_num )
    say ' === Page='page_num'; column ='m
* ----------
    n = 1       
    while( n <= y_num )
      say ' === Page='page_num'; row ='n
*     --- set virtual page
      _vpage.m.n
      _parea.m.n
*     --- time settings
*     --- multiple cases
      if( times_given = 1 ) 
        tt_given = subwrd(times,m)
        'set t 'tt_given
      else
        'set t 'tt
      endif
*     --- single case
      if( case_type = 's' )
        ms = (n-1) * x_num + m
        if( times_given = 1 )
          tt_given = subwrd(times,ms)
        else
          tt_given = t_beg + (ms-1)*t_int   
        endif
        'set t 'tt_given
      endif
*     ---
*     --- plot setting   
      'set xlint 'xlint_num
      'set ylint 'ylint_num
*      'set grid off'
      'set grid on 5 1'
      'set grads off'
      'set font 5'
*     --- reset domain
      if( reset_domain = 1 ) 
        'set 'lon_domain
        'set 'lat_domain
      endif
*     --- determine case_n, multiple or single case ?
      case_n = n
      if( case_type = 's' )
        case_n = case_no
      endif
*       'cnbasemap'
*
* ======== Start to plot variabels ========
      'set map 1 1 8'
*      'set mpdset hires'
      
      'set xlopts 1 6 0.15'
      'set ylopts 1 6 0.15'
      'set clopts 1 6 0.15'

'set rgb 92 255 245 215'
'set rgb 93 224 234 239'
*     --- shaded color 
*    do_color_set ( color_set )
*     'set clevs  '_nheight
*     'set rbcols '_ncolor
*     --- plot fog top
*     if( color_bar = 1 )
        do_color_set ( color_set )
        'set clevs  '_nheight
        'set rbcols '_ncolor
*     endif

'set grid off'
'set gxout shaded'
    if ( t_beg1 = 7 ) 
      'd (a1'ss'+a11'ss')/2'
    else
      'd a1'ss
    endif
*'set grid on 2 1'
'set cthick 5'
*'set map 'map_color
'set map 1 1 8'
*'draw map'
'set ccolor 1'
          'set gxout vector'
          'set arrowhead 0.1'
*          'set arrowhead 0.2'arrowhead
          'set arrsclsize 0.9'
          'set arrscl 'length' 'scale
*          'set arrlab off'
*'set arrscl 0.4 6'
*'d a1'ss';a2'ss
'set ccolor 1'
*'d a1'ss';a2'ss
    if ( t_beg1 = 7 ) 
*      'd (a1'ss'+a11'ss')/2'
    else
*      'd a1'ss
    endif
*'d a1'ss';a2'ss';mag(a1'ss', a2'ss')'
case_name='2full_aslp_mon_'ss
*      'basemap L 92 92 M'

*     --- plot height on 1000hPa
*     --- plot U10, V10
      if( wind_plot = 1 ) 
        if( wind_type = 1 ) 
          'set gxout barb'
          'set digsiz 'barb_size
          blen = 10. / full_barb
        endif
        if( wind_type = 2 )
          'set gxout vector'
          'set arrowhead 'arrowhead
          'set arrscl 'length' 'scale
          'set arrlab off'
          blen = 1
        endif
        'set ccolor 1'
        intv = interval
*        'set z 1'
*        u_part = 'skip(U.'case_n','intv')'
*        v_part = 'skip(V.'case_n','intv')'
         u_part = 'skip(u10m,'intv')'
         v_part = 'skip(v10m,'intv')'
*         'd 'u_part'*2.5 ; 'v_part'*2.5'
*'d a1'ss';a2'ss';mag(a1'ss', a2'ss')'
*'d a1'ss';a2'ss''
*    if ( t_beg1 = 7 ) 
*'d (a1'ss'+a11'ss')/2;(a2'ss'+a11'ss')/2'
*      'basemap L 92 92 M'
         endif
*         'd skip(u,10);skip(v,10)'
*       lon1=116.40
*       lat1=18.00
*       'q w2xy 'lon1' 'lat1''
*        x1=subwrd(result,3)
*        y1=subwrd(result,6)
*        'set line 1'
*        'draw mark 5 'x1' 'y1' 0.15'
'set map 1 1 5'
*      'set mpdset hires'
'draw map'
       
      
*
* ======== Stop ploting variabels ========
*

*     --- draw  LST
      date_time = get_date_time ( UTC2LST )
*
*     --- calculate size settings for titles
*
      y1 = 0.65 * title_resize
      x2 = 6.00 * title_resize
      strsize1 = 0.40 * title_resize
      str_x    = 0.24 * title_resize
      str_y    = 0.52 * title_resize
*
      yy1 = 1.40 * title_resize
      yy2 = 0.65 * title_resize
      xx1 = 1.30 * title_resize
      strsize2 = 0.50 * title_resize
      str_xx1  = 0.70 * title_resize
      str_xx2  = 0.24 * title_resize
      str_xx3  = 0.47 * title_resize
      str_yy   = 1.25 * title_resize
*
*     ---- first row
      if( n = 1 ) 
        'set line 0'
*        'draw recf 0.02 'y_v - y1' 'x2' 'y_v
*        'set line 1 1 6'
*        'draw  rec 0.02 'y_v - y1' 'x2' 'y_v
*        'set strsiz 'strsize1
*        'draw string 'str_x' 'y_v - str_y' 'date_time
      else
*     ---- from the second row
        if( time_title = 1 )
*          'set line 0'
*          'draw recf 0.02 'y_v - y1' 'x2' 'y_v
*          'set line 1 1 6'
*          'draw  rec 0.02 'y_v - y1' 'x2' 'y_v
*          'set strsiz 'strsize1
*          'draw string 'str_x' 'y_v - str_y' 'date_time
        endif
      endif
*     --- draw plot number
      if( time_title = 0 & n >= 2 ) 
        yy1 = yy1 - yy2
        str_yy = str_yy - yy2
        yy2 = 0
      endif
      'set line 0'
*      *'draw recf 0.02 'y_v - yy1' 'xx1' 'y_v - yy2
*      'set line 1 1 6'
*      *'draw rec  0.02 'y_v - yy1' 'xx1' 'y_v - yy2
      'set strsiz 'strsize2
      if( case_type = 'm' )
        case_num  = subwrd(case,n)
        title_num = subwrd(title,m)
*       * 'draw string 'str_xx1'  'y_v - str_yy' 'case_num
*       * 'draw string 'str_xx2'  'y_v - str_yy' 'title_num
      endif
      if( case_type = 's' )
        ms = (n-1) * x_num + m
        title_num = subwrd(title,ms)
*        'draw string 'str_xx3'  'y_v - str_yy' 'title_num
      endif

* --- add a bold frame around the old one
      add_frame()
*
      'set vpage off '
      'set parea off '
      n = n + 1
    endwhile
*   -------------
    tt = tt + t_int
    m  =  m + 1
  endwhile

**************************************************
*****  End of LOOP for plotting panels !!! *******
**************************************************


* === plot longtitude and latitude labels
* --- define labels along axises.
* --- longitude
  nloop = 1
  nxlab = 0
  while( nloop < 1000 )
    xlab = ( nloop - 1 ) * xlint_num
    if( xlab >= (xlon1) & xlab <= (xlon2) )
*    if( xlab >= (xlon1+0.2) & xlab <= (xlon2-0.2) )
      if( nxlab = 0 )
        xlab_beg = xlab 
      endif 
      nxlab = nxlab + 1
    endif
    nloop = nloop + 1
  endwhile
* --- latitude
  nloop = 1
  nylab = 0
  while( nloop < 1000 )
    ylab = ( nloop - 1 ) * ylint_num - 90
    if( ylab >= (ylat1) & ylab <= (ylat2) )
*    if( ylab > (ylat1+0.2) & ylab < (ylat2-0.2) )
      if( nylab = 0 )
        ylab_beg = ylab
      endif
      nylab = nylab + 1
    endif
    nloop = nloop + 1
  endwhile
* --- check
*  say xlab_beg'  'ylab_beg
*  say nxlab'  'nylab


* --- longitude
  y_lon = y_sta - string_size * 0.5
  x  = x_sta
  m  = 1
  axis_unit = '`3.`n'
  xaxis_unit_end = '`3.`1E'
  yaxis_unit_end = '`3.`1N'
  while( x < x_end )
* ----------
    nx = 1
    xlen = xlon2 - xlon1
    while( nx <= nxlab )
      xlon = xlab_beg + (nx-1) * xlint_num
      pos_cent = ( xlon - xlon1 ) / xlen
      pos = x + pos_cent * x_int
     'set string 1 tc 5'
     'set strsiz 'string_size
      if( xlon <= 180 ) 
*        'draw string 'pos' 'y_lon' 'xlon'E'
        if ( nx = nxlab )
          'draw string 'pos' 'y_lon' 'xlon''xaxis_unit_end''
        else
          'draw string 'pos' 'y_lon' 'xlon''axis_unit''
        endif
      else
         xlonw = 360 - xlon
        'draw string 'pos' 'y_lon' 'xlonw'W'
      endif
      nx = nx + 1
    endwhile
*   -------------
    x  =  x + x_int
    m  =  m + 1
  endwhile

* --- latitude
*  x_lat = x_end + string_size * 1.40 + 0.05
  x_lat = x_sta - string_size * 1.40 + 0.05
  y = y_beg - y_int
  n = 1
  while( y >= y_sta )
* ----------
    ny = 1
    ylen = ylat2 - ylat1
    while( ny <= nylab )
      ylat = ylab_beg + (ny-1) * ylint_num
      pos_cent = ( ylat - ylat1 ) / ylen
      pos = y + pos_cent * y_int
     'set string 1 c'
     'set strsiz 'string_size
      if( ylat < 0 ) 
        ylats = ylat * (-1)
        'draw string 'x_lat-0.1' 'pos' 'ylats'S'
      endif
      if( ylat = 0 )
*        'draw string 'x_lat-0.12' 'pos+0.08' EQ'
      endif
      if( ylat >= 0 ) 
        if ( ny = nylab )
          'draw string 'x_lat-0.12' 'pos-0.05' 'ylat''axis_unit''
          'draw string 'x_lat-0.18' 'pos+0.15' N'
        else
          'draw string 'x_lat-0.1' 'pos' 'ylat''axis_unit''
        endif
*        'draw string 'x_lat' 'pos' 'ylat'N'
      endif
      ny = ny + 1
    endwhile
*   -------------
    y = y - y_int
    n = n + 1
  endwhile


* === plot color bar 
* --- dependent on x_end and x_sta
* --- bar_length_percent = 0.55

* --- start to draw color bar below

  if( page_type = 'p' )
    percent = 0.95 
  endif
  if( page_type = 'l' )
    percent = 0.55
  endif
  delx = x_end - x_sta
  half_deltx = delx * 0.5 
  bar_length = delx * percent
  x_beg  = half_deltx - bar_length  * 0.5 +0.5
  x_tail = x_beg + bar_length

  if( color_bar = 1 )
* --- draw bar only
* --- calculate nbar = 13 ?
  nbar_num = 1
  nbar = 0
  while( nbar_num < 40 )
    val = subwrd( _nheight , nbar_num )    
    if( val = '' ) 
    else
      nbar = nbar + 1
    endif
    nbar_num = nbar_num + 1
  endwhile

  x0 = x_end + 0.2
  y0 = y_beg - (5.1+bar_height) - string_size 
  m  = 1
  while( m <= nbar+1 )
    col_bar = subwrd( _ncolor, m )
    if( m = 1 )
      hei_bar = ''
    else
      hei_bar = subwrd( _nheight, m-1 )
    endif
    'set line 'col_bar' 1'
    xint  = (x_tail - x_beg)/nbar
    ybar1 = x0 + (m-1)*xint -5
    ybar2 = ybar1 + xint
    x2=x0+0.2
    if( m <= nbar )
      'draw recf 'x0' 'ybar1' 'x2' 'ybar2
    endif
*   --- draw string
   'set string 1 tc'
   'set strsiz 'bar_str_size
*   'draw string 'x0+0.55' 'ybar1'  'hei_bar
    if( m <= 11 )
       'draw string 'x0+0.50' 'ybar1'  'hei_bar
   endif
    if( m > 11 )
       'draw string 'x0+0.57' 'ybar1'  'hei_bar
    endif
*   --- next
    m  =  m + 1
  endwhile
*   --- draw unit
  'set strsiz 'bar_str_size
*  'draw string 'xbar1+0.45' 'y0-0.05' 'var_unit

  endif
* --- stop drawing color bar here


* --- draw vector scale right to color bar
  if( wind_type = 2 )
    len = length * ( x_int / xsiz )
    x   = x_tail + 1.0
    y   = y_sta -  0.15 - string_size 
    if( color_bar = 1 )
      y = y0 + bar_height * 0.30 
    endif
    'set line 1 1 4'
    'draw line 'x-len/2.' 'y' 'x+len/2.' 'y
    'draw line 'x+len/2.-0.05' 'y+0.03' 'x+len/2.' 'y
    'draw line 'x+len/2.-0.05' 'y-0.03' 'x+len/2.' 'y
    'set string 1 c'
    'set strsiz 'bar_str_size
    'draw string 'x' 'y-bar_str_size-0.05' 'scale' m/s'
  endif

* --- output name
  outname = case_name

*
* --- output *.gm pictures
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
*  '! convert -density 144 -antialias 'outname'.eps 'outname'.bmp'
*  '! convert -density 144 -antialias 'outname'.bmp 'outname'.jpg'
else
* --- imagick software needed
  '! convert -density 1200 -resize 25% 'outname'.eps tmp.jpg'
  '! convert -density 600  tmp.jpg 'outname'.jpg'
*  '! convert -resize 50% 'outname'.jpg 'outname'.gif'
  '! rm -f    tmp.jpg'
endif

  '! rm -f 'outname'.bmp'
  '! rm -f 'outname'.eps'

* --- Big Loop End
    'clear'
    'reset'
    page_num = page_num + 1
  endwhile

* --- exit GrADS
  quit

*================== function definitions ==================
* 
*
function incdtgh(dtgh,inc)
*
*  increment a dtg by inc hours
*  RESTRICTIONS!!
*  (1)  inc > 0
*  (2)  inc < 24
*
  moname='JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC'
  monday='31 28 31 30 31 30 31 31 30 31 30 31'

  iyr=substr(dtgh,1,2)*1
  imo=substr(dtgh,3,2)*1
  ida=substr(dtgh,5,2)*1
  ihr=substr(dtgh,7,2)*1

  if(mod(iyr,4)=0)
    monday='31 29 31 30 31 30 31 31 30 31 30 31'
  endif

  ihr=ihr+inc
*  say 'ihr = 'ihr
*  say 'ida = 'ida

  if(ihr>=24)
    ihr=ihr-24
    ida=ida+1
  endif

*  say 'new ihr = 'ihr' new ida = 'ida' imo = 'imo
  if(ida > subwrd(monday,imo))
    ida=ida-subwrd(monday,imo)
*    say 'inside check ida = 'ida' monday = 'subwrd(monday,imo)
    imo=imo+1
  endif

  if(ida <= 0)
    imo=imo-1
    ida=subwrd(monday,imo)-ida+1
  endif

  if(imo>=13)
    imo=imo-12
    iyr=iyr+1
  endif

  if(imo<10);imo='0'imo;endif
  if(ida<10);ida='0'ida;endif
  if(ihr<10);ihr='0'ihr;endif

*return (iyr%imo%ida%ihr)
* --- Gao changed
  mon=subwrd(moname,imo)
return (ihr%'00LST '%ida%' '%mon)


function mod(i0,inc)
  if(inc!=0)
    imod=int(i0/inc)
  else
    imod=int(i0/1)
  endif
  imod=i0-imod*inc
return(imod)

function int(i0)
  i=0
  while(i<12)
    i=i+1
    if(substr(i0,i,1)='.')
      i0=substr(i0,1,i-1)
      break
    endif
  endwhile
return(i0)

function add_frame()
  'q gxinfo'
  line3 = sublin(result,3)
  line4 = sublin(result,4)
  x1 = subwrd(line3,4)
  x2 = subwrd(line3,6)
  y1 = subwrd(line4,4)
  y2 = subwrd(line4,6)
  'set line 1 1 6'
  'draw rec 'x1' 'y1' 'x2' 'y2
return

function do_color_set(args)
  color_num = subwrd(args,1) 
* --- 1: blue and red ( for difference)
  if( color_num = 1 ) 
    'set rgb 16   0   0 255'
    'set rgb 17  55  55 255'
    'set rgb 18 110 110 255'
    'set rgb 19 165 165 255'
    'set rgb 20 220 220 255'
    'set rgb 21 255 220 220'
    'set rgb 22 255 165 165'
    'set rgb 23 255 110 110'
    'set rgb 24 255  55  55'
    'set rgb 25 255   0   0'
    'set rgb 26 160   0   0'
    _ncolor  = '16  17  18  19  20  0  21 22 23 24 25 26'
    _nheight = '-5  -4  -3  -2  -1  0  1  2  3  4  5'
  endif
* --- 2: gray, red and green ( for seafog top )
  if( color_num = 2 )
    'set rgb 79 130 130 130'
    'set rgb 80 150 150 150'
    'set rgb 81 170 170 170'
    'set rgb 82 190 190 190'
    'set rgb 83 255 225 230'
    'set rgb 84 255 189 200'
    'set rgb 85 255 157 172'
    'set rgb 86 255 120 141'
    'set rgb 87 255  60  90'
    'set rgb 88 220   0  30'
    'set rgb 89 156 235 176'
    'set rgb 90  94 220 125'
    'set rgb 91  37 175  70'
    'set rgb 92  29 137  56'
    'set rgb 99  82  85 209'
    _ncolor  = '79  80  81  82  83  84  85  86  87  88  89  90  91 92'
    _nheight = '50 100 150 200 250 300 350 400 450 500 550 600 650'
  endif
* --- 3: gray, blue and green ( for seafog top )
  if( color_num = 3 )
    'set rgb 79 130 130 130'
    'set rgb 80 150 150 150'
    'set rgb 81 170 170 170'
    'set rgb 82 190 190 190'
    'set rgb 83 220 220 247'
    'set rgb 84 200 200 233'
    'set rgb 85 180 180 219'
    'set rgb 86 160 160 205'
    'set rgb 87 140 140 191'
    'set rgb 88 120 120 177'
    'set rgb 92 156 235 176'
    'set rgb 91  94 220 125'
    'set rgb 90  37 175  70'
    'set rgb 89  29 137  56'
    'set rgb 99 255   0   0'
    _ncolor  = '79  80  81  82  83  84  85  86  87  88  89  90  91 92'
    _nheight = '50 100 150 200 250 300 350 400 450 500 550 600 650'
  endif
* --- 4: blue and red ( for difference)
  if( color_num = 4 ) 
    'set rgb 16   0   0 255'
    'set rgb 17  55  55 255'
    'set rgb 18 110 110 255'
    'set rgb 19 165 165 255'
    'set rgb 20 220 220 255'
    'set rgb 21 255 220 220'
    'set rgb 22 255 165 165'
    'set rgb 23 255 110 110'
    'set rgb 24 255  55  55'
    'set rgb 25 255   0   0'
    'set rgb 26 160   0   0'
    _ncolor  = '16   17  18  19  20  0  21  22 23 24 25 26'
    _nheight = '-2.5 -2 -1.5 -1 -0.5 0  0.5 1  1.5 2 2.5'
  endif
* --- 5: gray, red and green ( for seafog top )
  if( color_num = 5 )
    'set rgb 79 130 130 130'
    'set rgb 80 150 150 150'
    'set rgb 81 170 170 170'
    'set rgb 82 190 190 190'
    'set rgb 83 255 225 230'
    'set rgb 84 255 189 200'
    'set rgb 85 255 157 172'
    'set rgb 86 255 120 141'
    'set rgb 87 255  60  90'
    'set rgb 88 220   0  30'
    'set rgb 89 156 235 176'
    'set rgb 90  94 220 125'
    'set rgb 91  37 175  70'
    'set rgb 92  29 137  56'
    'set rgb 99  82  85 209'
    _ncolor  = '79  80  81  82  83  84  85  86  87  88  89  90  91 92  '
    _nheight = '10  12  14  16  18  20  22  24  26  28  30  32  34'
   endif
* --- 6: gray, blue and green ( for seafog top )
  if( color_num = 6 )
    'set rgb 79 130 130 130'
    'set rgb 80 150 150 150'
    'set rgb 81 170 170 170'
    'set rgb 82 190 190 190'
    'set rgb 83 220 220 247'
    'set rgb 84 200 200 233'
    'set rgb 85 180 180 219'
    'set rgb 86 160 160 205'
    'set rgb 87 140 140 191'
    'set rgb 88 120 120 177'
    'set rgb 92 156 235 176'
    'set rgb 91  94 220 125'
    'set rgb 90  37 175  70'
    'set rgb 89  29 137  56'
    'set rgb 99 255   0   0'
    _ncolor  = '0 79  80  81  82  83  84  85  86  87  88  89  90  91 92'
*    _nheight = ' 6  8   10  12  14  16  18  20  22  24  26  28  30'
*    _nheight = '9 10  12  14  16  18  20  22  24  26  28  30  32  33'
    _nheight = '9 10  11  12  13  14  15  16  17  18 19  20  21  22  '
  endif
* --- 7: white and red 
  if( color_num = 7 )
     'set rgb 21  139  0  22'
     'set rgb 22  178  0  31'
     'set rgb 23  197  0  35'
     'set rgb 24  223  0  41'
     'set rgb 25  229 70  70'
     'set rgb 26  238 124 107'
     'set rgb 27  245 168 154 '
     'set rgb 28  252 218 213'
     'set rgb 29  148 83  5' 
     'set rgb 30  189 107 9' 
     'set rgb 31  208 119 11' 
     'set rgb 32  236 135 14' 
     'set rgb 33  240 156 66' 
     'set rgb 34  245 177 109' 
     'set rgb 35  250 206 156'
     'set rgb 36  255 250 250'
    _ncolor  = ' 0 36 35 34 33 32 31 30 29 28 27 26  25  24  23 22 21'
*    _nheight = ' 2  4  6  8  10 12 14 16 18 20 22  24  26  28 30'
    _nheight = ' 9 10 11 12 13 14 15 16 17 18 19 20  21  22 23 24 '
  endif
* --- 8: white and red 
  if( color_num = 8 )
     'set rgb 21  255 250 250'
     'set rgb 22  255 230 230'
     'set rgb 23  255 210 210'
     'set rgb 24  255 190 190'
     'set rgb 25  255 170 170'
     'set rgb 26  255 150 150'
     'set rgb 27  255 130 130 '
     'set rgb 28  255 110 110'
     'set rgb 29  255 90  90' 
     'set rgb 30  255 70  70' 
     'set rgb 31  255 50  50' 
     'set rgb 32  255 30  30' 
     'set rgb 33  255 10 10' 
     'set rgb 34  235 0  0' 
     'set rgb 35  215 0  0'
     'set rgb 36  195 0  0'
     'set rgb 37  175 0  0'
     'set rgb 38  155 0  0'
     'set rgb 39  135 0  0'
     'set rgb 40  115 0  0'
    _ncolor  = ' 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40'
*    _nheight = ' 12 15 18 21 24 27 30 33 36 39 42 45 48 51 54 57 63 69 75'
    _nheight = ' 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27'
  endif
* --- 9: white and red 
  if( color_num = 9 )
     'set rgb 29 237  138  138'
     'set rgb 28 202   71   71'
     'set rgb 30 88   36   31'
     'set rgb 31 223   50   17'
     'set rgb 32 255   73    0'
     'set rgb 33 252 75 45'
     'set rgb 34 253 118 52'
     'set rgb 35 252 154 38'
     'set rgb 36 248 205 89'
     'set rgb 37 250 235 110'
     'set rgb 38 238 251 132'
     'set rgb 39 197 248 136'
     'set rgb 40 168 247 155'
     'set rgb 41 139 250 189'
     _ncolor = '0  41 40 39 38 37 36 35 34 33 31 30 29'
     _nheight ='10 11 12 13 14 15 16 17 18 19 20 22 '
  endif
* --- 3: gray, blue and green ( for seafog top and hebei mcape !!! )
  if( color_num = 10 )
    'set rgb 79 130 130 130'
    'set rgb 80 150 150 150'
    'set rgb 81 170 170 170'
    'set rgb 82 190 190 190'
    'set rgb 83 220 220 247'
    'set rgb 84 200 200 233'
    'set rgb 85 180 180 219'
    'set rgb 86 160 160 205'
    'set rgb 87 140 140 191'
    'set rgb 88 120 120 177'
    'set rgb 92 156 235 176'
    'set rgb 91  94 220 125'
    'set rgb 90  37 175  70'
    'set rgb 89  29 137  56'
    'set rgb 99 255   0   0'
    _ncolor  = '    0   79   80   81   82   83   84   85   86   87   88   89   90   91   92'
    _nheight = '    400 600  800  1000 1200 1400 1600 1800 2000 2200 2400 2600 2800 3000  '
*    _nlabel  = ' no 400 600  800  1000 1200 1400 1600 1800 2000 2200 2400 2600 2800 3000 no'
  endif
  if( color_num = 123 ) 
'set rgb 21 30 114 178'
'set rgb 22 29 111 173'
'set rgb 23 28 108 168'
'set rgb 24 27 103 163'
'set rgb 25 25 99 156'
'set rgb 26 23 95 149'
'set rgb 27 19 89 140'
'set rgb 28 20 76 130'
'set rgb 29 21 63 120'
'set rgb 30 23 49 110'
'set rgb 31 22 36 93'
'set rgb 32 21 23 76'
_ncolor  = ' 21   22  23  24   25   26   27   28   29 30  31 32'
_nheight = ' 0.4 0.6 0.8  1   1.2 1.4 1.6 1.8  2 2.2 2.4 '
  endif
  if( color_num = 124 ) 
'set rgb 21 0 204 204'
'set rgb 22 0 192 192'
'set rgb 23 0 180 180'
'set rgb 24 0 168 168'
'set rgb 25 0 153 153'
'set rgb 26 0 141 141'
'set rgb 27 0 129 129'
'set rgb 28 0 117 117'
'set rgb 29 0 102 102'
'set rgb 30 0 77 77'
'set rgb 31 0 52 52'
'set rgb 32 0 27 27'  
_ncolor  = ' 21   22  23  24   25   26   27   28   29 30  31 32'
_nheight = ' 0.4 0.6  0.8  1   1.2  1.4  1.6  1.8  2  2.2 2.4' 
  endif
  if( color_num = 125 ) 
'set rgb 21 0 77 137'
'set rgb 22 0 51 119'
'set rgb 23 0 35 109'
'set rgb 24 0 21 98'
'set rgb 25 0 5 89'
'set rgb 26 0 24 68'
'set rgb 27 0 38 59'
'set rgb 28 0 54 49'
'set rgb 29 0 66 40'
'set rgb 30 0 82 29'
'set rgb 31 0 96 21'
'set rgb 32 0 110 10'
_ncolor  = ' 21   22  23  24   25   26   27   28   29 30  31 32'
_nheight = ' 0.4 0.6  0.8  1   1.2  1.4  1.6  1.8  2  2.2 2.4' 
  endif
  if( color_num = 126 ) 
'set rgb 61 254 254 170'
'set rgb 60 238 254 254'

'set rgb 41 128 0 0'
'set rgb 40 191 0 0'
'set rgb 39 252 33 0'
'set rgb 38 252 64 0'
'set rgb 37 252 97 0'
'set rgb 36 252 128 0'
'set rgb 35 252 161 0'
'set rgb 34 252 191 0'
'set rgb 33 252 224 0'
'set rgb 32 252 252 0'
'set rgb 31 255 255 255'
'set rgb 30 204 252 252'
'set rgb 29 153 252 252'
'set rgb 28 102 252 252'
'set rgb 27 51 252 252'
'set rgb 26 0 255 255'
'set rgb 25 0 224 255'
'set rgb 24 0 191 224'
'set rgb 23 0 161 191'
'set rgb 22 0 128 161'
'set rgb 21 0 97 128'
'set rgb 200 0 65 86'
_ncolor  = ' 200 21   22  23  24   25   26   27   28   29 30 61 32 33 34 35 36 37 38 39 40 41 '
_nheight = '-5.0 -4.5 -4.0 -3.5 -3.0 -2.5 -2.0 -1.5 -1.0 -0.5 0.0 0.5 1.0 1.5 2.0 2.5 3.0 3.5 4.0 4.5 5.0' 
  endif
*
* ======================= End of this gs file ============================
return

function get_date_time ( args )
  'q time'
  b = subwrd(result,3)
  UTC2LST = subwrd(args,1) 
  if( UTC2LST = 0 )
    uhour = substr(b,1,2)
    udate = substr(b,4,2)
    month = substr(b,6,3)
    date_time=uhour%'00LST '%udate%' '%month
  endif
  if( UTC2LST = 1 )
    mon='JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC'
    yy = substr(b,11,2)
    mm = substr(b,6,3)
    dd = substr(b,4,2)
    hh = substr(b,1,2)
    im = 1
    while ( im <= 12 )
      mo=subwrd( mon, im )
      if( mo = mm )
        mt = im
        if( mt < 10 )
          mt = '0'mt
        endif
        break
      endif
      im = im + 1
    endwhile
    dtgh = yy%mt%dd%hh
    inc  = 8
    date_time = incdtgh(dtgh,inc)
  endif
return(date_time)


* ---------------- oringinal settings -------------------
*      'set line 0'
*      'draw recf 0.02 'y_v -0.65' 6.0 'y_v' '
*      'set line 1 1 6'
*      'draw  rec 0.02 'y_v -0.65' 6.0 'y_v' '
*      'set strsiz 0.4'
*      'draw string 0.24 'y_v-0.55' 'date_time''
*     --- draw plot number
*      'set line 0'
*      'draw recf 0.02 'y_v -1.4' 1.3 'y_v -0.65' '
*      'set line 1 1 6'
*      'draw rec  0.02 'y_v -1.4' 1.3 'y_v -0.65' '
*      'set strsiz 0.5'
*      case_name = subwrd(case,n)
*      title_num = subwrd(title,m)
*      'draw string 0.72 'y_v -1.25' 'case_name
*      'draw string 0.26 'y_v -1.25' 'title_num
* --------------------------------------------------------


*
* ======================= End of this gs file ============================
