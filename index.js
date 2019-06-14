const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const port = 7000
const config = require('./config')
const knex = require('knex')(config.options);

app.use(bodyParser.json())
app.use(cors())
app.get('/', (req, res) => res.send(req.query))

//localhost:7000/subject_type
app.get('/subject_type', async (req, res) => {
  try {
    let rows = await knex('subject_type')
      .orderBy('subject_type_id')
    res.send({
      ok: 1,
      subject_type: rows,
    })
  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }

})

//localhost:7000/major/1
app.get('/major/:subject_type_id', async (req, res) => {
  try {
    if (req.params.subject_type_id === 'all') {
      let rows = await knex('major')
        // .where('type_code', '=', req.params.subject_type_id)
        .orderBy('major_id')
      res.send({
        ok: 1,
        major: rows,
      })
    } else {
      let rows = await knex('major')
        .where('subject_type_id', '=', req.params.subject_type_id)
        .orderBy('major_id')
      res.send({
        ok: 1,
        major: rows,
      })
    }
  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }
})

//localhost:7000/minor/2101
app.get('/minor/:major_id', async (req, res) => {
  try {
    if (req.params.major_id === 'all') {
      rows = await knex('minor')
        // .where('major_id', '=', req.params.major_id)
        .orderBy('minor_id')
      res.send({
        ok: 1,
        minor: rows,
      })
    } else {
      rows = await knex('minor')
        .where('major_id', '=', req.params.major_id)
        .orderBy('minor_id')
      res.send({
        ok: 1,
        minor: rows,
      })
    }
  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }
})

//localhost:7000/media_type
app.get('/media_type', async (req, res) => {
  try {
    let rows = await knex('media_type')
      .orderBy('media_type_id')
    res.send({
      ok: 1,
      media_type: rows,
    })
  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }

})

//localhost:7000/school
app.get('/school', async (req, res) => {
  try {
    let rows = await knex('school')
      .orderBy('school_id')
    res.send({
      ok: 1,
      school: rows,
    })
  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }
})

app.get('/school/items', async (req, res) => {
  try {
    let rows = await knex('school')
      .select('school_id', 'school_name')
      .orderBy('school_id')
    res.send({
      ok: 1,
      school: rows,
    })
  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }
})

//localhost:7000/teacher
app.get('/teacher', async (req, res) => {
  try {
    let rows = await knex('teacher')
      .orderBy('teacher_name')
    res.send({
      ok: 1,
      teacher: rows,
    })
  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }
})

//localhost:7000/media/123456789098
app.get('/media/:citizen_id', async (req, res) => {
  console.log(req.params.citizen_id)
  try {
    if (req.params.citizen_id == 'all') {
      let rows = await knex('media')
        // .where('citizen_id', '=', req.params.citizen_id)
        .orderBy('id')
      res.send({
        ok: 1,
        media: rows,
      })
    } else {
      let rows = await knex('media')
        .where('citizen_id', '=', req.params.citizen_id)
        .orderBy('id')
      res.send({
        ok: 1,
        media: rows,
      })

    }

  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }

})

app.get('/mediaAll/', async (req, res) => {
  try {
    let rows = await knex.select('*').from('media')
      .orderBy('media_type_id')
    res.send({
      ok: 1,
      media: rows,
    })
  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }

})

//localhost:7000/login
// user:''  pass:''
app.post('/login', async (req, res) => {
  try {
    let row = await knex('user')
      .select('email', 'citizen_id', 'fname', 'lname')
      .where({
        email: req.body.email,
        password: knex.raw("MD5('" + req.body.password + "')")
      })
      .then(rows => rows[0])
    if (!row) {
      throw new Error('อีเมล์หรือรหัสผ่าน ไม่ถูกต้อง')
    }
    res.send({
      ok: 1,
      user: row
    })
  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }
})

app.get('/user/:citizen_id', async (req, res) => {
  try {
    let row = await knex('user')
      .select('email', 'citizen_id', 'fname', 'lname', 'phone', 'line_id', 'website')
      .where({
        citizen_id: req.params.citizen_id
        // email: req.body.email,
        // password: knex.raw("MD5('" + req.body.password + "')")
      })
      .then(rows => rows[0])
    if (!row) {
      throw new Error('อีเมล์หรือรหัสผ่าน ไม่ถูกต้อง')
    }
    res.send({
      ok: 1,
      user: row
    })
  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }
})

//localhost:7000/api/teacher

app.post('/api/teacher', async (req, res) => {
  try {
    if (!req.body.citizen_id || !req.body.teacher_name || !req.body.school_name) {
      throw new Error('citizen_id, teacher_name, school_name is required')
    }
    let row = await knex('teacher').where({
      citizen_id: req.body.citizen_id
    }).then(rows => rows[0])
    if (!row) {
      let ids = await knex('teacher').insert({
        citizen_id: req.body.citizen_id,
        teacher_name: req.body.teacher_name,
        school_name: req.body.school_name,
        academic: req.body.academic,
        depart: req.body.depart,
        position: req.body.position,
        phone: req.body.phone,
        line_id: req.body.line_id,
        e_mail: req.body.e_mail,
        website: req.body.website,
      })
      res.send({
        ok: 1,
        id: ids[0]
      })
    } else {
      await knex('teacher')
        .where({
          citizen_id: req.body.citizen_id
        })
        .update({
          teacher_name: req.body.teacher_name,
          school_name: req.body.school_name,
          academic: req.body.academic,
          depart: req.body.depart,
          position: req.body.position,
          phone: req.body.phone,
          line_id: req.body.line_id,
          e_mail: req.body.e_mail,
          website: req.body.website,
        })
      res.send({
        ok: 1,
        id: row.id
      })
    }
  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }
})

// localhost:7000/api/media
app.post('/api/media', async (req, res) => {
  try {
    if (!req.body.citizen_id || !req.body.media_name || !req.body.course_level) {
      throw new Error('citizen_id, media_name, course_level is required')
    }
    //let row = await knex('media').where({citizen_id: req.body.citizen_id}).then(rows => rows[0])
    //if (!row) {
    let ids = await knex('media').insert({
      citizen_id: req.body.citizen_id,
      course_level: req.body.course_level,
      subject_type_id: req.body.subject_type_id,
      major_id: req.body.major_id,
      minor_id: req.body.minor_id,
      subject_name: req.body.subject_name,
      subject_code: req.body.subject_code,
      media_type_id: req.body.media_type_id,
      media_name: req.body.media_name,
      amount: req.body.amount,
      note: req.body.note,
      link_google: req.body.link_google,
      e_training: req.body.e_training,
    })
    res.send({
      ok: 1,
      id: ids[0]
    })
    //} 
    // else {
    //   await knex('media')
    //     .where({citizen_id: req.body.citizen_id})
    //     .update({
    //       citizen_id: req.body.citizen_id,
    //       course_level: req.body.course_level,
    //       subject_type: req.body.subject_type,
    //       major: req.body.major,
    //       minor: req.body.minor,
    //       subject_name: req.body.subject_name,
    //       subject_code: req.body.subject_code,
    //       media_type: req.body.media_type,
    //       media_name: req.body.media_name,
    //       amount: req.body.amount,
    //       link_google: req.body.link_google,
    //       e_training: req.body.e_training,
    //     })
    //   res.send({ ok: 1, id: row.id })
    // }
  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }
})
app.put('/api/media', async (req, res) => {
  try {
    if (!req.body.id || !req.body.media_name || !req.body.course_level) {
      throw new Error('id, media_name, course_level is required')
    }
    //let row = await knex('media').where({citizen_id: req.body.citizen_id}).then(rows => rows[0])
    //if (!row) {
    let result = await knex('media')
      .where({
        id: req.body.id,
      })
      .update({
        course_level: req.body.course_level,
        subject_type_id: req.body.subject_type_id,
        major_id: req.body.major_id,
        minor_id: req.body.minor_id,
        subject_name: req.body.subject_name,
        subject_code: req.body.subject_code,
        media_type_id: req.body.media_type_id,
        media_name: req.body.media_name,
        amount: req.body.amount,
        note: req.body.note,
        link_google: req.body.link_google,
        e_training: req.body.e_training,
      })
    res.send({
      ok: 1,
      num_rows: result.updatedRows || 0
      // id: ids[0]
    })
  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }
})

app.post('/api/signin', async (req, res) => {
  try {
    if (!req.body.citizen_id || !req.body.fname || !req.body.school_id) {
      throw new Error('ต้องกรอกรหัสบัตรประชาชน ชือ นามสกุล และสถานศึกษา')
    }
    let row = await knex('user').where({
      citizen_id: req.body.citizen_id
    }).then(rows => rows[0])
    if (!row) {
      let ids = await knex('user').insert({
        citizen_id: req.body.citizen_id,
        fname: req.body.fname,
        lname: req.body.lname,
        school_id: req.body.school_id,
        password: knex.raw('MD5("' + req.body.password + '")'),
        // academic: req.body.academic,
        // depart: req.body.depart,
        // position: req.body.position,
        // phone: req.body.phone,
        // line_id: req.body.line_id,
        email: req.body.email
        // website: req.body.website,
      })
      res.send({
        ok: 1,
        id: ids[0]
      })
    }
  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }
})
app.put('/api/signin/', async (req, res) => {
  try {
    if (!req.body.citizen_id || !req.body.fname || !req.body.school_id) {
      throw new Error('ต้องกรอกรหัสบัตรปรชาชน ชือ นามสกุล และสถานศึกษา')
    }
    let row = await knex('teacher').where({
      citizen_id: req.body.citizen_id
    }).then(rows => rows[0])
    if (!row) {
      let ids = await knex('teacher').update({
        citizen_id: req.body.citizen_id,
        fname: req.body.fname,
        school_id: req.body.school_id,
        academic: req.body.academic,
        depart: req.body.depart,
        position: req.body.position,
        phone: req.body.phone,
        line_id: req.body.line_id,
        e_mail: req.body.e_mail,
        website: req.body.website,
      }).where({
        id: req.body.citizen_id
      })
      res.send({
        ok: 1,
        id: ids[0]
      })
    }
  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }
})

app.delete('/api/media/:id', async (req, res) => {
  try {
    await knex('media').where({
      id: req.params.id
    }).del()
    res.send({
      ok: 1,
    })
  } catch (e) {
    res.send({
      ok: 0,
      error: e.message
    })
  }

})

//app.use('/api/student',require('./api/student.js'))

app.listen(port, () => console.log(`listening on port ${port}!`))