const express = require('express')
const router = express.Router()
module.exports = router

router.get('/:code', async(req, res) => {
  let rows=await req.knex('student')
  .where('code','=',req.params.code)
  .orderBy('code')
  res.send({
    ok: 1,
    //student: rows,
    student: rows[0] || null,
  })
})

router.get('/room/:room', async(req, res) => {
  let rows=await req.knex('student')
  .where('room','=',req.params.room)
  .orderBy('code')
  res.send({
    ok: 1,
    student: rows ,
  })
})

router.get('/teacher_code/:teacher_code',  async(req, res) => {
  let rows=await req.knex('student as st')
  .join('teacher_room as tr','tr.room','st.room')
  .where('tr.teacher_code','=',req.params.teacher_code)
  .select('st.*')
  res.send({
    ok: 1,
    student: rows ,
  })
})