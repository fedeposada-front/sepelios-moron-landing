import { useState } from 'react'
import { cmsItem, cmsItems } from '../cms/parseCMS'
import { resolveButtonHref } from '../cms/links'
import { useSiteDataContext } from '../context/useSiteDataContext'
import { CMSButtons, CMSCardActions } from './CMSBlocks'

export default function FAQ() {
  const { data, cms } = useSiteDataContext()
  const section = cmsItem(cms, 'seccion', 'preguntas')
  const questions = cmsItems(cms, 'faq')
  const questionHref = resolveButtonHref(section, data, 'whatsapp', section.button_message || data.wa_msg_faq)
  const [openId, setOpenId] = useState(null)

  return (
    <section className="section" id="preguntas">
      <div className="wrap">
        <div className="faq-wrap">
          <div className="reveal">
            <span className="eyebrow">{section.eyebrow}</span>
            <h2 style={{ fontSize: 'clamp(28px,3.4vw,40px)', marginTop: '16px' }}>{section.titulo}</h2>
            <p style={{ color: 'var(--muted)', marginTop: '16px', fontSize: '16px' }}>{section.descripcion}</p>
            {questionHref && <a className={`btn ${questionHref.startsWith('https:') ? 'btn--wa' : 'btn--primary'} btn--lg`} style={{ marginTop: '24px' }} href={questionHref} target={questionHref.startsWith('https:') ? '_blank' : undefined} rel={questionHref.startsWith('https:') ? 'noopener noreferrer' : undefined}>
              {section.button_text || 'Hacer una consulta'}
            </a>}
          </div>
          <CMSButtons group="preguntas" />
          <div className="faq-list">
            {questions.map(item => {
              const expanded = openId === item.id
              const answerId = `faq-answer-${item.id}`
              return (
                <div key={item.id} className={expanded ? 'faq-item open' : 'faq-item'}>
                  <button className="faq-q" aria-expanded={expanded} aria-controls={answerId} onClick={() => setOpenId(expanded ? null : item.id)}>
                    {item.pregunta}
                    <span className="ic" aria-hidden="true"></span>
                  </button>
                  <div id={answerId} className="faq-a" hidden={!expanded} style={{ maxHeight: expanded ? '2000px' : '0' }}>
                    <p>{item.respuesta}</p>
                    <CMSCardActions item={item} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
