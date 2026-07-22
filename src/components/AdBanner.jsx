// Reusable ad banner slot
export default function AdBanner({ slot = '9810172647', style = 'horizontal', className = '' }) {
  return (
    <div className={`my-6 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6216304334889617"
        data-ad-slot={slot}
        data-ad-format={style === 'horizontal' ? 'auto' : style}
        data-full-width-responsive="true"
      />
      <script>{`(adsbygoogle = window.adsbygoogle || []).push({});`}</script>
    </div>
  )
}
