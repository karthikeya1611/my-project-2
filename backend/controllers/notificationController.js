const db = require('../db');

// GET /api/notifications
const getAllNotifications = async (req, res) => {
  try {
    const { unread_only } = req.query;
    let queryText = 'SELECT * FROM notifications';
    const params = [];

    if (unread_only === 'true') {
      queryText += ' WHERE is_read = false';
    }

    queryText += ' ORDER BY created_at DESC, id DESC LIMIT 50';
    const result = await db.query(queryText, params);

    const unreadCountRes = await db.query('SELECT COUNT(*) FROM notifications WHERE is_read = false');
    const unreadCount = parseInt(unreadCountRes.rows[0].count, 10);

    res.json({
      success: true,
      unread_count: unreadCount,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ success: false, message: 'Server error fetching notifications' });
  }
};

// PUT /api/notifications/:id/read
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification marked as read', data: result.rows[0] });
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).json({ success: false, message: 'Server error updating notification' });
  }
};

module.exports = {
  getAllNotifications,
  markNotificationAsRead
};
