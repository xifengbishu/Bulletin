* ---------------------------------------------------
* --- Purpose:
* ---  Draw fogtop coverage for both WRF and RAMS!
* ---  (plot multiple pics in one real page)
* ---
* ---  However, you can modify this code to do 
* ---  many other things for your own aim !
* ---------------------------------------------------
* --- History:
* ---  1) originally created
* ---     21 Jan 2010, Zhang Shoubao
* ---
* ---  2) some modifications
* ---     23 Jan 2010, Gao Shanhong. 
* ---     28 Jan 2010, Gao Shanhong. 
* ---
* ---  3) For WRF model
* ---     28 Feb 2010, Gao Shanhong.
* ---     You can reset lon_beg and lon_end
* ---                   lat_beg and lat_end
* ---     It still works for RAMS Model. 
* ---  
* ---  4) 01-16 Mar 2010, Yushan campus.
* ---     01: Adjust color of fogtop coverage
* ---         control page type
* ---         control times
* ---     02: control size of time titles and panels' number
* ---         draw color bar, check input
* ---         please change value of title_resize
* ---     04: add wind barb at 10m above sea level.
* ---     06: add labels of longitude and latitude
* ---     07: multiple/single case experiment control
* ---     09: xy-ratio is calculated aumomatically
* ---     10: draw two pictures for once operation
* ---     11: color bar can be not drawn
* ---         add wind vector plotting
* ---     16: convert time from UTC to LST if needed
* ---     21: simplify this script using functions
* ---     25: use gxyat from openGrADS to convert gm to png
* ---         without lines in picture
* ---
* ---  5) 10 Apr 2010, Yushan campus.
* ---     if color_bar=0, do not do set of clevs !!! 
* ---     do set of map: " set map 1 1 4 "
* ---    
* ---     08 May 2010, Yushan campus.
* ---     add control of color_bar unit
* ---     09 May 2010
* ---     correct a tiny bug:  
* ---          while( x <  x_end ) should be
* ---          while( x <= x_end - x_int )
* ---     
* ---  6) 13 May 2010, Yushan campus.
* ---     mask wind vectors in the fog area ?
* ---     
* ---  7) 05-11 Oct 2010, Yushan campus.
* ---     add case_type = 'msa'   
* ---     plot difference
* ---
* ---  8) 10 Nov 2011, Yushan campus.
* ---     add hgt/geopt shaded plotting.
* ---
* ---------------------------------------------------------
* --- Usgae: 
* ---   grads -bpc plot_fogtop.gs   for portrait
* ---   grads -blc plot_fogtop.gs   for landmaskscape
* ---------------------------------------------------------

* ============================================================
* ----                                                    ----
* -------------   Start Your Own Modifications   -------------
* ----                                                    ----
* ============================================================
*
* ------ domain settings
* ---
* ---    Page type
* ---      p: portrait ; l: landmaskscape
* ---      normally,  let page_type = 'p'
* ---      sometimes, let page_type = 'l'
* ---
* ---    Normally, you need not modify x_sta, x_end and y_beg
* ---    You should often do change of :
* ---       x_num, y_num, and yx_ratio especially !
* ---
* ---       x_num: time from left to right
* ---       y_num: case from up to down
* ---
* -------------------------------------------------
*
* --- Open GrADS ctl files
* --- ctl name (numbers = y_num)
'sdfopen ./uwnd.10m.mon.mean.nc'
'sdfopen ./vwnd.10m.mon.mean.nc'

* --- For doing difference plotting!
* --- The number should be the same as the above !
* --- Please use user-defined pressure/height in namelist.ARW !
* ---
* --- if_diff_open = 1 / 0 (1: open ctl ; 0: do not oprn ctl )
* ---
  if_diff_open = 0
  if( if_diff_open = 1 )
    'open ./seafog/case0/test.ctl '
    'open ./seafog/case0/test.ctl '
    'open ./seafog/case0/test.ctl '
    'open ./seafog/case0/test.ctl '
  endif

* ==============================================================


* --- multiple cases or single case ?
* --- m:   Multiple cases ( default )
* --- msa: Multiple cases at a Same/Any time, for diff plotting!
* --- s:   Single   cases ( should be declared explicitly! )
* --- "case_no = 4" means "open ../case4/*.ctl", for single only!
  plot_type   = 'msa'
  case_no     = 1
* --- For example, never use it unless you modify this script!
  my_own_plot = 0


* --- convert time from UTC to LST ?
* --- If the time is already LST, then no!
* --- UTC2LST = 1, yes ; 0, no
  UTC2LST = 1

* --- arrangement of page and pannels
* --- yx_ratio can be calculated aumomatically
* --- However, you can tune its value for your own aim
* ---
  page_type  = 'p'
  x_num      = 1
  y_num      = 1
  ratio_auto = 1
* --- Normally, do not use it.
  if( ratio_auto = 0 )
    yx_ratio  = 1.20
  endif

* --- It is ok for normal use
* --- Normally, do not need to change it.
  if( page_type = 'p' ) 
    x_sta =  0.25
    x_end =  8.0
    y_beg = 11.0
*    x_sta =  0.6
*    x_end =  7.8
*    y_beg = 10.90
  endif
  if( page_type = 'l' ) 
    x_sta =  0.25
    x_end = 10.65
    y_beg =  8.30
  endif
 
* ---  reset_domain = 1 / 0
* ---  1: yes ; 0: no (default domain is used)
  reset_domain = 1
  lon_domain   = 'lon 99 151'
  lat_domain   = 'lat  -1  51'

plot_wp_t6_70 = 0
plot_ave_spdln = 0
p_maxln_ter_70 = 1
plot_typhoon = 0
plot_nice = 0

wp_unit   = '`3*`110`a2`n Wm`a-2`n'
spd_unit  = 'ms`a-1`n'
if ( plot_wp_t6_70 = 1 )
  var2_unit = wp_unit
  case_name = 'wp_t6_70'
  color_bar    = 1
endif
if ( plot_ave_spdln = 1 )
  var2_unit = spd_unit
  case_name = 'ave_spdln'
  color_bar    = 1
endif
if ( p_maxln_ter_70 = 1 )
  var2_unit = spd_unit
  case_name = 'maxln_ter_70'
  color_bar    = 1
endif
if (  plot_typhoon = 1 )
  case_name = 'typhoon'
  color_bar    = 1
endif
* --- which vertical coordinate system ?
* --- vertical coord = lev / z
* --- which_vert     = 1, 2, 3.5
* ---
  vertical_coord = z 
  which_vert     = 1

* --- draw labels of longitude and latitude along axises
* --- xlint_num =5 means an interval of 5 deg. along X-axis
  string_size     = 0.12
  xlint_num       = 5.0
  ylint_num       = 5.0
  xlint_label_num = 5.0
  ylint_label_num = 5.0
* 
* --- draw color bar ( 1: yes ; 0: no )
* --- size of color bar string at the bottom
* --- height of color bar
  bar_str_size = 0.09
  bar_height   = 0.16
  color_set    = 22
 var_unit     = 'Wm`a-2`n'
* --- examples
* var_unit     = '`ao`nC'   celsius degree
* var_unit     = 'K'        K degree
* var_unit     = 'm'        meter
* var_unit     = 'mm'       precipitation
* var_unit     = '%'        rh
* var_unit     = 'gkg`a-`n' qvp

* --- wind vector/barb at 10m above sea level
* --- if_wind   ( 1: yes  ; 0: no )
* --- wind_type ( 1: barb ; 2: vector )
* --- wind_colr ( 0: white; 1: black; any other color! )
* --- full barb ( 4: 4m/s ; 5: 5m/s )
  if_wind   = 0
  wind_type = 2
  wind_colr = 1
*
* --- mask wind vectors in the fog area ?
* --- 0: do not mask ; 1: mask out
  mask_vector = 0
* 
* --- wind_type: barb
  if( wind_type = 1 ) 
    interval  = 25
    barb_size = 0.12
    full_barb = 4
  endif
* --- wind_type: vector
  if( wind_type = 2 )
    interval  = 10
    arrowhead = 0.10
*   --- arrow length: length
*   --- this length present the speed scale (m/s)
    length    = 0.8
    scale     = 10
  endif

* --- control the plotting of tc, qcw, qvp and rh
* --- 1: yes ; 0: no
* ---
* --- Colors:  1     2    3      4          5       6        8     9      12          15
* ---         black red green dark-blue light-blue magenta orange purple dark-yellow gray
* ---
* --- *_color_times is used to change values of "_ncvalue" ( not only for difference! )
* ---
  varname = ''
*
  if_tc  = 0
  if( if_tc = 1 ) 
    tc_color_times = 1.0
    varname = '_tc'
  endif
*
* ---
  if_qcw    = 0
  qcw_color = 1
*
* ---
  if_qvp          = 0
  qvp_color       = 4
  qvp_shaded      = 1
  qvp_color_set   = 1
  qvp_color_times = 0.8
  qvp_unit        = 'Wm`a-2`n'
  if( qvp_shaded = 1 & if_qvp = 1 )
    var_unit = qvp_unit
    varname = '_qvp'
    if_tc = 0
  endif

*
* ---
  if_rh           = 0
  rh_color        = 3
  rh_shaded       = 1
  rh_color_set    = 123
  rh_color_times  = 1
  rh_unit         = 'm/s'
  if( rh_shaded = 1 & if_rh = 1 )
    var_unit = rh_unit
    varname = '_rh'
    if_tc  = 0
    if_qvp = 0
  endif


*
* ---  if vertical coordinate is height
* ---  or vertical coordinate is Eta
  if_pres        = 0
  pres_color     = 3
  pres_shaded    = 1
  pres_color_set = 3
  p_color_times  = 1
  pres_unit        = '`3*`110`a2`n Wm`a-2`n'
  if( pres_shaded = 1 & if_pres = 1 )
    var_unit = pres_unit
    varname = '_press'
    if_tc  = 0
    if_qvp = 0
*    if_rh  = 0
  endif
*
* ---  if vertical coordinate is presure
* ---  or vertical coordinate is Eta
  if_hgt          = 0
*
* ---- potential height
*  hgt_var         = geopt
*  hgt_unit        = 'gpm'
*
* ---- height above sea level
  hgt_var         = height
  hgt_unit        = 'm'
*
  hgt_color       = 4
  hgt_shaded      = 1
  hgt_color_set   = 1
  hgt_color_times = 6.0
  if( hgt_shaded = 1 & if_hgt = 1 )
    var_unit = hgt_unit
    if_tc  = 0
    if_qvp = 0
    if_rh  = 0
  endif
  if( if_hgt = 1 )
    varname = '_'hgt_var
  endif

* --- set number of output picture (pic_num)
* --- set case name
  pic_num   = 1
* --- force pic_num =1 when case_type='s'
  if( case_type = 's')
    pic_num = 1
  endif 
  if( plot_type = 'msa')
    pic_num = 1
  endif

* --- time setting    ( tt = t_beg + (n-1)*t_int )
* --- begining times  ( t_beg )
* --- times interval  ( t_int )
* --- times can be given one by one (times_given=1)
* --- 1: give  ; 0: aumomatically calculated
* --- picture 1
    t_beg1       = 1
    t_int1       = 1
    times_given1 = 1
    times1       = ' 2 3 5 7 9 11 13 15 16 '
* --- picture 2
    t_beg2       = 11
    t_int2       = 2
    times_given2 = 0
    times2       = ' 11 13 15 17 19 '

* ---
* --- plot_type = 'msa' for every case
* --- number means 'set t msa_given'
* --- For example:
* --- msa_given = '1 1 1 1 1 1 1 1 1 1'
* --- msa_given = '1 2 1 3 1 1 5 1 1 1'  (not tested!)
* ---
    msa_given = '1 1 1 1 1 1 1 1 1 1 1 1 1'

* --- control difference plotting for every time/case!
* --- if_diff: 1, yes ; 0, no
* ---          =1 require plot_type = 'msa'!
* --- diff_no: details for every time/case:
* ---          0:  do not plot difference
* ---          1:  do plot difference
* --- e.g.     diff_no = ' 0 1 1 0 1 1 1 1 1 '
* ---          ( not good for shading plot because of color bar!)
* ---
* ---          diff_no = ' 1 1 1 1 1 1 1 1 1 '
* ---
    if_diff   = 0
    diff_no   = ' 1 1 1 1 1 1 1 1 1 1 1 1'
    diff_color_set = 1

* --- along X direction
* --- title number
    title1 = ' a b c d e f g h i j k l m n o p '
    title2 = ' e f g h i j k l'
* --- along Y direction
* --- experiment case name 
  case = ' A B C D E F '
  no_title = 1
* --- Change size of the title of Date-time & panel number
* --- title_resize is between 1.0 and 1.3
* --- It is normally 1.0 
  title_resize = 1.20

* --- the panels below the first row can be without
* --- date-time titles, but with panel number only !
* --- 1: with ; 0: without; -1: without for all (plot_type=msa) 
  time_title = 0

* =======================================
* ---- End of Your Own Modifications ----
* ---- Do not touch anything below.  ----
* =======================================


* --- which color set will be used ?
  if( if_diff = 1 )
    color_set = diff_color_set
    time_title = -1
    if( plot_type = 'msa' )
      file_num = 36
      while( file_num > 1 )
        'q file 'file_num
        rec = sublin(result,1)
        if_error  = subwrd(rec,3)
        if( if_error != "Error:" )
          file_num_opened = file_num
          break
        endif
        file_num = file_num - 1
      endwhile
      set_num = x_num * y_num * 2      
      if( set_num != file_num_opened )
        say ''
        say ' Error:'
        say '   x_num * y_num must be half of the opened ctl file number !'
        say '   x_num * y_num   = 'x_num' * 'y_num' = 'x_num * y_num
        say '   opened ctl-file = 'file_num_opened
        say '   Please check !!!'
        say ''
        quit
      else
        say ''
        say ' Message:'
        say '   Your settings for "plot_type=msa" is OK.'
        say '   Do not mind the "QUERY FILE Error" above !'
        say ''
      endif
    else
      say ''
      say ' Error:'
      say '   "if_diff = 1" requires "plot_type = msa" !'
      say ''
      quit
    endif
  endif


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

*
* ---- Step 1: check input
*
  'q gxinfo'
  rec  = sublin(result,2)
  xsiz = subwrd(rec,4)
  ysiz = subwrd(rec,6)
  if( xsiz = 8.5 & page_type = 'l' )
    say ' ======================================= '
    say ' '
    say ' Please grads -blc plot_fogtop.gs !  '
    say ' '
    say ' ======================================= '
    quit
  endif
  if( xsiz = 11 & page_type = 'p' )
    say ' ======================================= '
    say ' '
    say ' Please grads -bpc plot_fogtop.gs !  '
    say ' '
    say ' ======================================= '
    quit
  endif
    'set 'lon_domain
    'set 'lat_domain
say times_given
ss=times_given
t1=324+ss
*1975-1993year*
'define p1'ss'=ave(uwnd,t='t1',t=552,12)'
'define p2'ss'=ave(vwnd.2,t='t1',t=552,12)'
t2=780+ss
'define a1'ss'=uwnd(t='t2')-p1'ss''
'define a2'ss'=vwnd.2(t='t2')-p2'ss''
*2012.1*

*
* ---- Step 2: calculate yx_ratio 
* ----         longitude and latitude
  if( reset_domain = 1 )
    'set 'lon_domain
    'set 'lat_domain
  endif
  'set 'vertical_coord' 'which_vert
  if( ratio_auto = 1 )
    'display lon'
    say result
    'query gxinfo'
    line3=sublin(result,3)
    say line3
    line4=sublin(result,4)
    say line4
    tmpa=subwrd(line3,4)
    tmpb=subwrd(line3,6)
    tmpc=subwrd(line4,4)
    tmpd=subwrd(line4,6)
    yx_ratio=(tmpd-tmpc)/(tmpb-tmpa) - 0.18
    say 'yx_ratio 'yx_ratio
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
* ---- Step 3: define page settings for all panels
*
  x_int = ( x_end - x_sta ) / x_num 
  y_int = yx_ratio * x_int
  y_sta = y_beg - y_num*y_int
  say y_int' ' x_int' ' y_sta
  'set vpage 0 'x_int' 0 'y_int''
  say result
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

* --- do check of page settings for all panels
  say ' ------- Do check of page setting below -------- '
  if( page_type = p )
    say '  Page type: portrait'
    x_limit = 8.5
  else
    say '  Page type: landscape'
    x_limit = 11.0
  endif
  say '  Whole page area: '
  x_check = x_end + 2.8 * string_size + 0.05
  y_check = y_sta 
  y_limit = 0.1 + string_size + bar_height + bar_str_size + 0.05
  say '    X:  'x_sta' ---> 'x_limit
  say '    Y:  'y_beg' ---> 'y_limit
  if( x_check > x_limit | y_check < y_limit )
    say ''
    say '  Error:'
    say '   Page setting is not right, please check! '
    if( x_check > x_limit )
      say '   x > x_end ('x_check' > 'x_limit')'
    endif
    if( y_check < y_limit )
      say '   y < y_end ('y_check' < 'y_limit')'
    endif
    say ''
    say '  Suggestions:'
    if( y_check < y_limit )
      say ''
      say '   Do you use page_type = "p" ?'
      say '   If not, please try to use it at first!'
    endif
    say ''
    say '  Suggestions:'
    say '   a) decrease x_end or y_num value if y < y_end'
    say '   b) decrease x_end or string_size value if x > x_end'
    say '   c) change page type'
    say '   d) re-arrange x_xum and y_num'
    say ' ================================================ '
    say ''
    quit
  else
    say '  Your page setting:'
    say '    X:  'x_sta' ---> 'x_check
    say '    Y:  'y_beg' ---> 'y_check
    say '  It seems OK!'
    say ''
  endif


*
* ---- Step 4: start to plot panel one by one
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

*     --- plot setting   
      'set xlint 'xlint_num
      'set ylint 'ylint_num
      'set grid off'
      'set grads off'
      'set font 2'
      if( if_pres = 2 & pres_shaded = 1 )
        if( color_bar = 1 )
          do_color_set ( pres_color_set )
          times_ncvalue ( p_color_times )
          'set clevs  '_ncvalue
          'set rbcols '_ncolor
        endif
        'set gxout shaded'
*          'd wt6_ln.'case_n
          'd wp_ln.'number
      endif
*     --- pressure, contour
      if( if_pres = 2 )
        if( color_bar = 1 )
          do_color_set ( rh_color_set )
          times_ncvalue ( rh_color_times )
          'set clevs  '_ncvalue
          'set rbcols '_ncolor
        endif
        'set gxout contour'
        'set cthick 6'
        'set clab on'
        'set ccolor 6'
        'set clopts -1 -1 0.18'
        'set cmin 5'
*          'd we_ln.'case_n
          'd wt6_ln.'number'/1000'
        'set cthick 4'
      endif

      if( if_rh = 1 & rh_shaded = 1 )
        if( color_bar = 1 )
*          do_color_set ( rh_color_set )
*          times_ncvalue ( rh_color_times )
*          'set clevs  '_ncvalue
*          'set rbcols '_ncolor
        endif
        'set gxout shaded'
*          'd wt6_ln.'case_n
*          'd ave_spdln.'number
      endif
*          'cbarn'
      'basemap L 0 99 M'

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
      'set datawarn off'
*     --- time settings
*     --- multiple cases
      if( times_given = 1 ) 
        tt_given = subwrd(times,m)
*        'set t 'tt_given
      else
*        'set t 'tt
      endif
      mt = m
*     --- single case
      if( case_type = 's' )
        ms = (n-1) * x_num + m
        if( times_given = 1 )
          tt_given = subwrd(times,ms)
        else
          tt_given = t_beg + (ms-1)*t_int   
        endif
        mt = ms
*        'set t 'tt_given
      endif
*     --- multiple cases at a same/any time
      if( plot_type = 'msa' )
        ms  = (n-1) * x_num + m
        tt_given = subwrd(msa_given,ms)
*        'set t 'tt_given
        mt = ms
      endif
*     
*     --- plot setting   
      'set xlint 'xlint_num
      'set ylint 'ylint_num
      'set grid on 2 1'
      'set grads off'
      'set font 2'
*     --- reset domain
      if( reset_domain = 1 ) 
        'set 'lon_domain
        'set 'lat_domain
      endif
      'set 'vertical_coord' 'which_vert
*     --- determine case_n, multiple or single case ?
      case_n = n
      if( case_type = 's' )
        case_n = case_no
      endif
      if( plot_type = 'msa' )
        case_n = (n-1) * x_num + m
      endif

*
* ======== Start to plot variabels ========
* 
*     --- set map  
*      'set map 1 1 4'
'set map 'map_color' 1 6'
      'set mpdset hires'
      'draw map'
* ===================

      'set xlint 'xlint_num
      'set ylint 'ylint_num
      'set grid off'
      'set grads off'
      'set font 5'
      'set ylab off'
unit_size = 0.095
map_color = 99
*map_color = 1
'set rgb 99 178 178 178'
*'set grid on 2 1'
'set xlint 4'
'set ylint 5'
'set font 5'
'set xlopts 1 4 0.10'
'set ylopts 1 4 0.10'
'set clopts 1 4 0.1'
'set map 'map_color' 1'
      'set mpdset hires'
*'draw map'
*-----maxln_ter_70  ---------
if ( p_maxln_ter_70 = 1 )


        if( color_bar = 1 )
          do_color_set ( rh_color_set )
          times_ncvalue ( rh_color_times )
          'set clevs  '_ncvalue
          'set rbcols '_ncolor
        endif

'set grid off'
*'set grid on 2 1'
'set gxout vector'
'set cthick 5'
*'set map 'map_color
'set map 1 1 6'
'draw map'
'set ccolor 1'
'set arrscl 0.4 6'
'd a1'ss';a2'ss';mag(a1'ss', a2'ss')'
case_name='year_'ss
      'basemap L 15 15 M'

endif

*'set map 'map_color
*      'set mpdset hires'
*'draw map'
* ===================
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
  if ( no_title = 0 )
      if( n = 1 & time_title >=0 ) 
        'set line 0'
        'draw recf 0.02 'y_v - y1' 'x2' 'y_v
        'set line 1 1 6'
        'draw  rec 0.02 'y_v - y1' 'x2' 'y_v
        'set strsiz 'strsize1
        'draw string 'str_x' 'y_v - str_y' 'date_time
      else
*     ---- from the second row
        if( time_title = 1 )
          'set line 0'
          'draw recf 0.02 'y_v - y1' 'x2' 'y_v
          'set line 1 1 6'
          'draw  rec 0.02 'y_v - y1' 'x2' 'y_v
          'set strsiz 'strsize1
          'draw string 'str_x' 'y_v - str_y' 'date_time
        endif
      endif
*     --- draw plot number
      if( ( time_title = 0 & n >= 2 ) | time_title = -1 ) 
        yy1 = yy1 - yy2
        str_yy = str_yy - yy2
        yy2 = 0
      endif
      'set line 0'
      'draw recf 0.02 'y_v - yy1' 'xx1' 'y_v - yy2
      'set line 1 1 6'
      'draw rec  0.02 'y_v - yy1' 'xx1' 'y_v - yy2
      'set strsiz 'strsize2
      if( case_type = 'm' )
        case_num  = subwrd(case,n)
        title_num = subwrd(title,m)
        'draw string 'str_xx1'  'y_v - str_yy' 'case_num
        'draw string 'str_xx2'  'y_v - str_yy' 'title_num
      endif
      if( case_type = 's' )
        ms = (n-1) * x_num + m
        title_num = subwrd(title,ms)
        'draw string 'str_xx3'  'y_v - str_yy' 'title_num
      endif
      if( plot_type = 'msa' )
        ms = (n-1) * x_num + m
        title_num = subwrd(title,ms)
        'draw string 'str_xx3'  'y_v - str_yy' 'title_num
      endif
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


*
* ---- Step 5
*
* === plot longtitude and latitude labels
* --- define labels along axises.
* --- longitude
  nloop = 1
  nxlab = 0
  while( nloop < 1000 )
    xlab = ( nloop - 1 ) * xlint_label_num
    if( xlab >= (xlon1+0.2) & xlab <= (xlon2-0.2) )
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
    ylab = ( nloop - 1 ) * ylint_label_num - 90
    if( ylab > (ylat1+0.2) & ylab < (ylat2-0.2) )
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
*  while( x <= x_end - x_int )
  while( m <= x_num )
* ----------
    nx = 1
    xlen = xlon2 - xlon1
    while( nx <= nxlab )
      xlon = xlab_beg + (nx-1) * xlint_label_num
      pos_cent = ( xlon - xlon1 ) / xlen
      pos = x + pos_cent * x_int
     'set string 1 tc'
     'set strsiz 'string_size
      if( xlon <= 180 )
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
  x_lat = x_end + string_size * 1.40 + 0.05
  y = y_beg - y_int
  n = 1
*  while( y >= y_sta )
  while( n <= y_num )
* ----------
    ny = 1
    ylen = ylat2 - ylat1
    while( ny <= nylab )
      ylat = ylab_beg + (ny-1) * ylint_label_num
      pos_cent = ( ylat - ylat1 ) / ylen
      pos = y + pos_cent * y_int
     'set string 1 c'
     'set strsiz 'string_size
      if( ylat < 0 )
        ylats = ylat * (-1)
        'draw string 'x_lat' 'pos' 'ylats'S'
      endif
      if( ylat = 0 )
        'draw string 'x_lat' 'pos' EQ'
      endif
      if( ylat > 0 )
        if ( ny = nylab )
          'draw string 'x_lat-0.4' 'pos' 'ylat''yaxis_unit_end''
        else
          'draw string 'x_lat-0.4' 'pos' 'ylat''axis_unit''
        endif
      endif
      ny = ny + 1
    endwhile
*   -------------
    y = y - y_int
    n = n + 1
  endwhile

*
* ---- Step 6
*
* === plot color bar 
* --- dependent on x_end and x_sta
* --- bar_length_percent = 0.55

* --- start to draw color bar below

  if( page_type = 'p' )
    percent = 0.65 
  endif
  if( page_type = 'l' )
    percent = 0.55
  endif
  delx = x_end - x_sta
  half_deltx = delx * 0.5 
  bar_length = delx * percent
  x_beg  = half_deltx - bar_length  * 0.5
  x_tail = x_beg + bar_length

  if( color_bar = 1 )
* --- draw bar only
* --- calculate nbar = ?
  nbar_num = 1
  nbar = 0
  while( nbar_num < 40 )
    val = subwrd( _ncvalue , nbar_num )    
    if( val = '' ) 
    else
      nbar = nbar + 1
    endif
    nbar_num = nbar_num + 1
  endwhile

  x0 = x_beg
  y0 = y_sta - (0.1+bar_height) - string_size 
  m  = 1
  while( m <= nbar+2 )
    col_bar = subwrd( _ncolor, m )
*    if( m = 1 )
*      hei_bar = ''
*    else
*      hei_bar = subwrd( _ncvalue, m-1 )
*    endif
    hei_bar = subwrd( _nlabel, m )
*
    'set line 'col_bar' 1'
    xint  = (x_tail - x_beg)/nbar
    xbar1 = x0 + (m-1)*xint
    xbar2 = xbar1 + xint
    if( m <= nbar+1 )
      'draw recf 'xbar1' 'y0' 'xbar2' 'y0+bar_height
      'set line 1 1 1'
      'draw rec  'xbar1' 'y0' 'xbar2' 'y0+bar_height
    endif
*   --- draw string
   'set string 1 tc'
   'set strsiz 'bar_str_size
   if( hei_bar != 'no' ) 
     'draw string 'xbar1' 'y0-0.05'  'hei_bar
   else
     if( m >= nbar+2 )
       xbar1 = xbar1 - xint
     endif
   endif
*   --- next
    m  =  m + 1
  endwhile
*   --- draw unit
  'set strsiz 'bar_str_size
  'draw string 'xbar1+0.70' 'y0-0.05' 'var2_unit
*  'draw string 'xbar1+0.30' 'y0-0.05' 'var_unit

  endif
* --- stop drawing color bar here

*
* ---- Step 7
*
* --- draw vector scale right to color bar
  if( if_wind =1 & wind_type = 2 )
    len = length * ( x_int / xsiz )
    x   = x_tail + 1.0
    y   = y_sta -  0.13 - string_size 
    if( color_bar = 1 )
      y = y0 + bar_height * 0.30 
    endif
    'set line 1 1 4'
    'draw line 'x-len/2.' 'y' 'x+len/2.' 'y
    'draw line 'x+len/2.-0.05' 'y+0.03' 'x+len/2.' 'y
    'draw line 'x+len/2.-0.05' 'y-0.03' 'x+len/2.' 'y
    'set string 1 c'
    'set strsiz 'bar_str_size
    'draw string 'x' 'y-bar_str_size-0.05' 'scale' ms`a-1`n'
  endif

*
* ---- Step 8
*
* --- output name
  if( pic_num >= 2 ) 
    outname = case_name''page_num
  else
    outname = case_name
  endif
  if( if_diff = 1 )
    outname = case_name'_diff'
  endif

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
else
* --- imagick software needed
  '! convert -density 1200 -resize 25% -trim 'outname'.eps tmp.jpg'
  '! convert -density 300  tmp.jpg 'outname'.jpg'
*  '! convert -resize 50% 'outname'.jpg 'outname'.gif'
  '! rm -f    tmp.jpg'
endif

  '! rm -f 'outname'.bmp'
  '! rm -f 'outname'.eps'
*  '! mv 'outname'.gif RESULT'
*  '! mv 'outname'.jpg Marine_Science'
*********************************loop of time****************************
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
  moname = 'JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC'
  monday = '31 28 31 30 31 30 31 31 30 31 30 31'

  iyr = substr(dtgh,1,2)*1
  imo = substr(dtgh,3,2)*1
  ida = substr(dtgh,5,2)*1
  ihr = substr(dtgh,7,2)*1

  if( mod(iyr,4) = 0 )
    monday = '31 29 31 30 31 30 31 31 30 31 30 31'
  endif

  ihr = ihr + inc
*  say 'ihr = 'ihr
*  say 'ida = 'ida

  if( ihr >= 24 )
    ihr = ihr - 24
    ida = ida + 1
  endif

*  say 'new ihr = 'ihr' new ida = 'ida' imo = 'imo
  if( ida > subwrd(monday,imo) )
    ida = ida - subwrd(monday,imo)
*    say 'inside check ida = 'ida' monday = 'subwrd(monday,imo)
    imo = imo+1
  endif

  if( ida <= 0 )
    imo = imo - 1
    ida = subwrd(monday,imo) - ida + 1
  endif

  if( imo >= 13 )
    imo = imo - 12
    iyr = iyr + 1
  endif

  if( imo < 10 ); imo = '0'imo; endif
  if( ida < 10 ); ida = '0'ida; endif
  if( ihr < 10 ); ihr = '0'ihr; endif

*return (iyr%imo%ida%ihr)
* --- Gao changed
  mon = subwrd(moname,imo)
return (ihr%'00LST '%ida%' '%mon)

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


function mod( i0, inc )
  if( inc!=0 )
    imod = int(i0/inc)
  else
    imod = int(i0/1)
  endif
  imod = i0 - imod*inc
return(imod)

function int(i0)
  i = 0
  while( i < 12 )
    i = i + 1
    if( substr(i0,i,1) = '.' )
      i0 = substr(i0, 1, i-1)
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


function times_ncvalue( ncvalue_times )
  ncvalue = ''
  cnum = 1
  while( cnum <= 30 )
    rec = subwrd(_ncvalue,cnum)
*    say rec
    if( rec != '' )
      rc = rec * ncvalue_times
      ncvalue = ncvalue' 'rc
    else
      break
    endif
    cnum = cnum + 1
  endwhile
  _ncvalue = ncvalue
return


function do_color_set(args)
*
* --- You can add other color sets for your own use.
*
  color_num = subwrd(args,1) 
*
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
    _ncvalue = '-5  -4  -3  -2  -1  0  1  2  3  4  5'
    _nlabel  = 'no -5  -4  -3  -2  -1  0  1  2  3  4  5 no'
  endif
* --- 1_rh: blue and red ( for rh difference)
  if( color_num = 1_rh )
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
    _ncolor  = '  79  80  81  82  83  84  85  86  87  88  89  90  91 92'
    _ncvalue = '  50 100 150 200 250 300 350 400 450 500 550 600 650'
    _nlabel  = '0 50 100 150 200 250 300 350 400 450 500 550 600 650 no'
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
    _ncolor  = '    79  80  81  82  83  84  85  86  87  88  89  90  91 92'
    _ncvalue = '    50 100 150 200 250 300 350 400 450 500 550 600 650'
    _nlabel  = ' no 50 100 150 200 250 300 350 400 450 500 550 600 650 no'
  endif
* --- 3: gray, blue and green ( for seafog top )
  if( color_num = 3 )
    'set rgb 73 255 225 230'
    'set rgb 74 255 189 200'
    'set rgb 75 255 157 172'
    'set rgb 76 255 120 141'
    'set rgb 77 255  60  90'
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
    'set rgb 89  29 137  56'
    'set rgb 90  37 175  70'
    'set rgb 91  94 220 125'
    'set rgb 92 156 235 176'
    'set rgb 99 255   0   0'
*    _ncolor  = '    0   84   85   86   87   88   92   91   90   89   73   74    74 76 77'
*    _ncvalue = '    200 300 400   500  600  700  800  900  1000 1200 1400 1600 1800 2000 '
*    _nlabel  = ' no 3  4  5  6  7  8  9   10  11  12  13  14   15  16  17  18  19  20  21  no'
    _ncolor  = '    0   83   84   85   86   87   88 92 91 90 89    73   74    75 76 77'
    _ncvalue = '    100 200 300  400   500  600  700  800  900  1000 1200 1400 1600 1800 2000 '
    _nlabel  = ' no 3  4  5  6  7  8  9   10  11  12  13  14   15  16  17  18  19  20  21  no'
*    _ncolor  = '    0    79   81    83   85  87   92 89 '
*    _ncvalue = '    5000 5500 6000 6500 7000 7500 8000'
*    _nlabel  = ' no 50 55 60 65 70 75 80  no'
  endif
* -----
* --- 4: blue and red ( for inversion )
  if( color_num = 4 )
    'set rgb  16    0    0   30'
    'set rgb  17    4    4   37'
    'set rgb  18    8    8   44'
    'set rgb  19   12   12   51'
    'set rgb  20   16   16   58'
    'set rgb  21   20   20   65'
    'set rgb  22   24   24   72'
    'set rgb  23   28   28   79'
    'set rgb  24   32   32   86'
    'set rgb  25   36   36   93'
    'set rgb  26   40   40  100'
    'set rgb  27   44   44  107'
    'set rgb  28   48   48  114'
    'set rgb  29   52   52  121'
    'set rgb  30   56   56  128'
    'set rgb  31   60   60  135'
    'set rgb  32   70   70  142'
    'set rgb  33   80   80  149'
    'set rgb  34   90   90  156'
    'set rgb  35  100  100  163'
    'set rgb  36  110  110  170'
    'set rgb  37  120  120  177'
    'set rgb  38  130  130  184'
    'set rgb  39  140  140  191'
    'set rgb  40  150  150  198'
    'set rgb  41  160  160  205'
    'set rgb  42  170  170  212'
    'set rgb  43  180  180  219'
    'set rgb  44  190  190  226'
    'set rgb  45  200  200  233'
    'set rgb  46  210  210  240'
    'set rgb  47  220  220  247'
    'set rgb  48  255  250  205'
    'set rgb  49  255  247  185'
    'set rgb  50  255  244  165'
    'set rgb  51  255  241  145'
    'set rgb  52  255  238  125'
    'set rgb  53  255  226  113'
    'set rgb  54  255  214  101'
    'set rgb  55  255  202   89'
    'set rgb  56  255  190   77'
    'set rgb  57  255  178   65'
    'set rgb  58  255  166   53'
    'set rgb  59  255  154   41'
    'set rgb  60  255  142   29'
    'set rgb  61  255  130   17'
    'set rgb  62  255  118    5'
    'set rgb  63  255  106    0'
    'set rgb  64  255   94    0'
    'set rgb  65  255   82    0'
    'set rgb  66  255   70    0'
    'set rgb  67  255   58    0'
    'set rgb  68  255   46    0'
    'set rgb  69  255   34    0'
    'set rgb  70  235   24    0'
    'set rgb  71  215   14    0'
    'set rgb  72  195    4    0'
    'set rgb  73  175    0    0'
    'set rgb  74  155    0    0'
    'set rgb  75  135    0    0'
    'set rgb  76  115    0    0'
    'set rgb  77   95    0    0'
    'set rgb  78   75    0    0'
    'set rgb  79   55    0    0'
    'set rgb  80   30    0    0'
    'set rgb  81   10    0    0'
    _ncolor  = '   0   48  45    42   39   36   33   30   27   52    55   58   61   64   67   70  73    76  79 81'
    _ncvalue = '   200 300 400   500  600  700  800  900  1000 1100 1200 1300  1400 1500 1600 1700 1800 1900 2000 '
    _nlabel  = ' no 2  3  4  5  6  7  8  9   10  11  12  13  14   15  16  17  18  19  20  no'
*    _ncvalue = '   -8 -6 -4 -2  0  4  6  8 10 12 14 16 18 20 22 24 26'
*    _nlabel  = 'no -8 -6 -4 -2  0  4  6  8 10 12 14 16 18 20 22 24 26 no'
  endif
* ----
  if( color_num = 5 )
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
    _ncolor  = '16  17  18  19  20  21 22 23 24 25 26'
    _ncvalue = ' 4   6  8   10  12  14 16 18 20 22 '
    _nlabel  = ' no  4   6  8   10  12  14 16 18 20 22 no'
  endif
* -----
  if( color_num = 6 )
'set rgb 33 252 75 45'
'set rgb 34 253 118 52'
'set rgb 35 252 154 38'
'set rgb 36 248 205 89'
'set rgb 37 250 235 110'
'set rgb 38 238 251 132'
'set rgb 39 197 248 136'
'set rgb 40 168 247 155'
'set rgb 41 139 250 189'
    _ncolor = '   0  33  34  35  36    37  38   39   40   41 '
    _ncvalue = ' 200 400 600 800 1000 1200 1400 1600 1800 2000 '
*    _ncvalue = ' 200 300 400   500  600  700  800  900  1000 1100 1200 1300  1400 1500 1600 1700 1800 1900 2000 '
    _nlabel  = ' no 200 400 600 800 1000 1200 1400 1600 1800 2000 no'
*    _nlabel  = ' no 2 3  4  5  6  7  8  9   10  11  12  13  14   15  16  17  18  19  20  no'
  endif
* -----
* --- 4: Crainbow
  if( color_num = 7 ) 
'set rgb  16  255  47  0'
'set rgb  17  254  105  0'
'set rgb  18  252  137  0'
'set rgb  19  250  160  0'
'set rgb  20  246  178  0'
'set rgb  21  242  193  0'
'set rgb  22  236  205  0'
'set rgb  23  230  216  0'
'set rgb  24  221  225  0'
'set rgb  25  212  232  0'
'set rgb  26  201  239  0'
'set rgb  27  187  244  0'
'set rgb  28  171  248  0'
'set rgb  29  151  251  0'
'set rgb  30  125  253  0'
'set rgb  31  88  254  0'
'set rgb  32  0  255  47'
'set rgb  33 0  254  105'
'set rgb  34  0  252  137'
'set rgb  35  0  250  160'
'set rgb  36  0  246  178'
'set rgb  37  0  242  193'
'set rgb  38  0  236  205'
'set rgb  39  0  230  216'
'set rgb  40  0  221  225'
'set rgb  41  0  212  232'
'set rgb  42  0  201  239'
'set rgb  43  0  187  244'
'set rgb  44  0  171  248'
'set rgb  45  0  151  251'
'set rgb  46  0  125  253'
'set rgb  47  0  0  255'
*    _ncolor = ' 0 45   42  39   36   33   30   27   24   21  18'
    _ncolor = '  45 41  38   34   31    27   23   19   16'
* ------  (max_spd)
*    _ncvalue ='    20 22  24  26    28   30   32    34   36 '
*    _nlabel  = ' no 20 22  24  26    28   30   32    34   36  no'
* ------ rh (ave_spd)
    _ncvalue ='     6    7      8    9   10   11  12  13'
    _nlabel  = ' no 6    7      8    9   10   11  12 13 no'
* ------ pre (WE)
*    _ncvalue ='   100 300  500  700  900  1100 1400 1700 2000 '
*    _nlabel  = ' no 1 3  5   7   9  11  14  17   20  no'
*    _ncolor = ' 0 45 42  39  37  35    33   31  29   27   25    23   21  19 17 16'
*    _ncvalue =' 100 200 300 400 500  600  700 800  900  1000 1200 1400 1600 1800 2000 '
*    _nlabel  = ' no 1 2 3  4  5  6  7  8  9   10  12  14   16   18   20  no'
  endif
* -----
* --- 4: Crainbow
  if( color_num = 8 ) 
   'set rgb  20 207 225 156'
   'set rgb  21 175 214 133'
   'set rgb  22 135 209 85'
   'set rgb  23 84 191 56'
   'set rgb  24 243 185 224'
   'set rgb  25 220 143 202'
   'set rgb  26 204 92 181'
    'set rgb 83 220 220 247'
    'set rgb 84 200 200 233'
    'set rgb 85 180 180 219'
    'set rgb 86 160 160 205'
    'set rgb 87 140 140 191'
    'set rgb 88 120 120 177'
*   'set rgb  27 244 246 142'
*   'set rgb  28 235 238 48'
    _ncolor = ' 0  83  84  85  86   87  88  20   21   22   23   24    25   26 '
    _ncvalue ='100 200 300 400 500 600  700 800  1000 1200 1400 1600  1800 '
    _nlabel  = ' no 1 2 3 4 5 6  7 8  10  12  14  16   18  no'
*    _ncvalue ='    3  4   5    6    7      8    9   10   11 '
*    _nlabel  = ' no 3  4   5    6    7      8    9   10   11  no'
  endif
* -----
* --- 4: green ==> yellow ==> red ==> black
  if( color_num = 2222 ) 
'set rgb  16    0   20    0'
'set rgb  17    5   26    2'
'set rgb  18   10   32    4'
'set rgb  19   15   38    6'
'set rgb  20   20   44    8'
'set rgb  21   25   50   10'
'set rgb  22   30   56   12'
'set rgb  23   35   62   14'
'set rgb  24   40   68   16'
'set rgb  25   45   74   18'
'set rgb  26   50   80   20'
'set rgb  27   55   86   22'
'set rgb  28   60   92   24'
'set rgb  29   65   98   26'
'set rgb  30   70  104   28'
'set rgb  31   75  110   30'
'set rgb  32   80  116   32'
'set rgb  33   85  122   34'
'set rgb  34   90  128   36'
'set rgb  35   95  134   38'
'set rgb  36  100  140   40'
'set rgb  37  105  146   42'
'set rgb  38  110  152   44'
'set rgb  39  115  158   46'
'set rgb  40  120  164   48'
'set rgb  41  125  170   50'
'set rgb  42  130  176   52'
'set rgb  43  135  182   54'
'set rgb  44  140  188   56'
'set rgb  45  145  194   58'
'set rgb  46  150  200   60'
'set rgb  47  155  206   62'
'set rgb  48  255  250  110'
'set rgb  49  249  238   98'
'set rgb  50  243  226   86'
'set rgb  51  237  214   74'
'set rgb  52  231  202   62'
'set rgb  53  225  190   50'
'set rgb  54  219  178   38'
'set rgb  55  213  166   26'
'set rgb  56  207  154   14'
'set rgb  57  201  142    2'
'set rgb  58  195  130    0'
'set rgb  59  189  118    0'
'set rgb  60  183  106    0'
'set rgb  61  177   94    0'
'set rgb  62  171   82    0'
'set rgb  63  165   70    0'
'set rgb  64  159   58    0'
'set rgb  65  153   46    0'
'set rgb  66  147   34    0'
'set rgb  67  141   22    0'
'set rgb  68  135   10    0'
'set rgb  69  129    0    0'
'set rgb  70  123    0    0'
'set rgb  71  117    0    0'
'set rgb  72  111    0    0'
'set rgb  73  105    0    0'
'set rgb  74   99    0    0'
'set rgb  75   93    0    0'
'set rgb  76   87    0    0'
'set rgb  77   81    0    0'
'set rgb  78   75    0    0'
'set rgb  79   69    0    0'
'set rgb  80   20    0    0'
    _ncolor  = '    0 44 40 36 32 28 48  52  56   60 64 68'
    _ncvalue = '    1 2  3  4  5  6  7   8  10  12   14   '
    _nlabel  = '  no  1   2    3    4    5   6    7  8  10  12   14  no '
  endif
* --- 4: Crainbow
  if( color_num = 7777 ) 
'set rgb  16  255  47  0'
'set rgb  17  254  105  0'
'set rgb  18  252  137  0'
'set rgb  19  250  160  0'
'set rgb  20  246  178  0'
'set rgb  21  242  193  0'
'set rgb  22  236  205  0'
'set rgb  23  230  216  0'
'set rgb  24  221  225  0'
'set rgb  25  212  232  0'
'set rgb  26  201  239  0'
'set rgb  27  187  244  0'
'set rgb  28  171  248  0'
'set rgb  29  151  251  0'
'set rgb  30  125  253  0'
'set rgb  31  88  254  0'
'set rgb  32  0  255  47'
'set rgb  33 0  254  105'
'set rgb  34  0  252  137'
'set rgb  35  0  250  160'
'set rgb  36  0  246  178'
'set rgb  37  0  242  193'
'set rgb  38  0  236  205'
'set rgb  39  0  230  216'
'set rgb  40  0  221  225'
'set rgb  41  0  212  232'
'set rgb  42  0  201  239'
'set rgb  43  0  187  244'
'set rgb  44  0  171  248'
'set rgb  45  0  151  251'
'set rgb  46  0  125  253'
'set rgb  47  0  0  255'
    _ncolor = '  45 41  38   34   31   27  23  19   16'
    _ncvalue ='  6  7    8    9   10   11  12  13'
    _nlabel  = '  no  6  7    8    9   10   11  12  13  no '
  endif
  if( color_num = 11111 ) 
'set rgb  16  255  47  0'
'set rgb  17  254  105  0'
'set rgb  18  252  137  0'
'set rgb  19  250  160  0'
'set rgb  20  246  178  0'
'set rgb  21  242  193  0'
'set rgb  22  236  205  0'
'set rgb  23  230  216  0'
'set rgb  24  221  225  0'
'set rgb  25  212  232  0'
'set rgb  26  201  239  0'
'set rgb  27  187  244  0'
'set rgb  28  171  248  0'
'set rgb  29  151  251  0'
'set rgb  30  125  253  0'
'set rgb  31  88  254  0'
'set rgb  32  0  255  47'
'set rgb  33 0  254  105'
'set rgb  34  0  252  137'
'set rgb  35  0  250  160'
'set rgb  36  0  246  178'
'set rgb  37  0  242  193'
'set rgb  38  0  236  205'
'set rgb  39  0  230  216'
'set rgb  40  0  221  225'
'set rgb  41  0  212  232'
'set rgb  42  0  201  239'
'set rgb  43  0  187  244'
'set rgb  44  0  171  248'
'set rgb  45  0  151  251'
'set rgb  46  0  125  253'
'set rgb  47  0  0  255'
*_nheight='22  24  26  28   30  32  34  36  38  40 44  48  52 '
*_ncolor=' 0  46  45   44   43  42  41  39  37  35 33  31  29  27  25  23  21  19 17'
_ncolor=' 0  43   41  37  33  29  25  21  19 17'
_ncvalue='20 25   30  35  40  45  50  55 60 '
_nlabel = '  no 20 25   30  35  40  45  50  55 60  no '
*_nheight='22  23  24  25  26 27  28  29  30  31  32 33  34  35  36  37  38  39  40 41 42'
*_nheight='20 24 28 32 36 40 44 48 52 56 60 '
*_ncolor=' 0  37 35 33 31 29 27 25 23 21 19 17'
  endif
* === black ( wp_ln )
  if( color_num = 222 ) 
'set rgb  65 255 255 255'
'set rgb  64 245 245 245'
'set rgb  63 225 225 225 '
'set rgb  62 205 205 205'
'set rgb  61 185 185 185'
'set rgb  60 165 165 165 '
'set rgb  59 165 165 165'
'set rgb  58 145 145 145'
'set rgb  57 125 125 125'
'set rgb  56 105 105 105'
'set rgb  55 85 85 85'
'set rgb  54 65 65 65'
'set rgb  53 45 45 45'
'set rgb  52 25 25 25'
'set rgb  51 5  5  5'
    _ncolor  = ' 0   63  61  59  58  57  56  55 54  53   52  0 '
*    _ncolor  = '   0  64  63  61 59  58  57  56  54  52   1 '
    _ncvalue = '    1  2  3   4  5   6   7   8  10  12   13  '
    _nlabel  = '  no  1   2    3    4    5   6    7  8  10  12   14  no '
  endif
* === black ( wt6_ln )
  if( color_num = 77 ) 
'set rgb  65 255 255 255'
'set rgb  64 245 245 245'
'set rgb  63 225 225 225 '
'set rgb  62 205 205 205'
'set rgb  61 185 185 185'
'set rgb  60 165 165 165 '
'set rgb  59 165 165 165'
'set rgb  58 145 145 145'
'set rgb  57 125 125 125'
'set rgb  56 105 105 105'
'set rgb  55 85 85 85'
'set rgb  54 65 65 65'
'set rgb  53 45 45 45'
'set rgb  52 25 25 25'
'set rgb  51 5  5  5'
    _ncolor  =' 0  63  61  59  57   55  53  51 '
    _ncvalue ='  5 6  7    8    9   10   11   '
    _nlabel  = '  no  5 6  7    8    9   10   11  no '
  endif
  if( color_num = 111 ) 
'set rgb  65 255 255 255'
'set rgb  64 245 245 245'
'set rgb  63 225 225 225 '
'set rgb  62 205 205 205'
'set rgb  61 185 185 185'
'set rgb  60 165 165 165 '
'set rgb  59 165 165 165'
'set rgb  58 145 145 145'
'set rgb  57 125 125 125'
'set rgb  56 105 105 105'
'set rgb  55 85 85 85'
'set rgb  54 65 65 65'
'set rgb  53 45 45 45'
'set rgb  52 25 25 25'
'set rgb  51 5  5  5'
_ncolor=' 0  63  61  59  57  55  54  53  51 '
_ncvalue='20 25   30  35  40  45  50  55 '
_nlabel = '  no 20 25   30  35  40  45  50  55  no '
*_nheight='22  23  24  25  26 27  28  29  30  31  32 33  34  35  36  37  38  39  40 41 42'
*_nheight='20 24 28 32 36 40 44 48 52 56 60 '
*_ncolor=' 0  37 35 33 31 29 27 25 23 21 19 17'
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
_ncvalue = ' 0.4 0.6  0.8  1   1.2  1.4  1.6  1.8  2  2.2 2.4' 
_nlabel = '  no 0.4 0.6 0.8  1   1.2 1.4 1.6 1.8  2 2.2 2.4 no '
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
_ncvalue = ' 0.4 0.6  0.8  1   1.2  1.4  1.6  1.8  2  2.2 2.4' 
_nlabel = '  no 0.4 0.6 0.8  1   1.2 1.4 1.6 1.8  2 2.2 2.4 no '
  endif
* -----
return


*
* ======================= End of this gs file ============================
