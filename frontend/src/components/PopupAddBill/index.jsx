import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Popup, Icon, Keyboard, Input, Toast } from 'zarm';
import cx from 'classnames';
import dayjs from 'dayjs';
import PopupDate from '../PopupDate';
import CustomIcon from '../CustomIcon';
import { get, typeMap, post } from '@/utils/config/type';
import s from './style.module.less';

const PopupAddBill = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const dateRef = useRef();
  const [payType, setPayType] = useState('expense');
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [currentType, setCurrentType] = useState({});
  const [expense, setExpense] = useState([]);
  const [income, setIncome] = useState([]);
  const [remark, setRemark] = useState('');
  const [showRemark, setShowRemark] = useState(false);

  useEffect(async () => {
    const {
      data: { list },
    } = await get('/type/list');
    const _expense = list.filter((i) => i.type == 1);
    const _income = list.filter((i) => i.type == 2);
    setExpense(_expense);
    setIncome(_income);
    setCurrentType(_expense[0]);
  }, []);

  const selectDate = (val) => {
    setDate(val);
  };

  const changeType = (type) => {
    setPayType(type);
  };

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      },
    };
  }

  const handleMoney = (value) => {
    value = String(value);
    let _amount = String(amount);

    if (value === 'delete') {
      if (!_amount) return;
      return setAmount(_amount.slice(0, _amount.length - 1));
    }
    if (value === 'ok') {
      addBill();
      return;
    }

    if (value === '.' && _amount.includes('.')) return;
    if (value !== '.' && _amount.includes('.') && _amount && amount.split('.')[1].length >= 2)
      return;
    setAmount(_amount + value);
  };

  // 添加账单
  const addBill = async () => {
    if (!amount) {
      Toast.show('请输入具体金额');
      return;
    }
    const params = {
      amount: Number(amount).toFixed(2), // 账单金额小数点后保留两位
      type_id: currentType.id, // 账单种类id
      type_name: currentType.name, // 账单种类名称
      date: dayjs(date).unix() * 1000, // 日期传时间戳
      pay_type: payType == 'expense' ? 1 : 2, // 账单类型传 1 或 2
      remark: remark || '', // 备注
    };
    const result = await post('/bill/add', params);
    // 重制数据
    setAmount('');
    setPayType('expense');
    setCurrentType(expense[0]);
    setDate(new Date());
    setRemark('');
    Toast.show('添加成功');
    setShow(false);
    if (props.onReload) props.onReload();
  };

  return (
    <Popup
      visible={show}
      direction='bottom'
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}>
      <div className={s.addWrap}>
        <header className={s.header}>
          <span className={s.close} onClick={() => setShow(false)}>
            <Icon type='wrong' />
          </span>
        </header>
        <div className={s.filter}>
          <div className={s.type}>
            <span
              onClick={() => changeType('expense')}
              className={cx({ [s.expense]: true, [s.active]: payType === 'expense' })}>
              支出
            </span>
            <span
              onClick={() => changeType('income')}
              className={cx({ [s.income]: true, [s.active]: payType == 'income' })}>
              收入
            </span>
          </div>
          <div className={s.time} onClick={() => dateRef.current && dateRef.current.show()}>
            {dayjs(date).format('MM-DD')} <Icon className={s.arrow} type='arrow-bottom' />
          </div>
        </div>

        <PopupDate ref={dateRef} onSelect={selectDate} />

        <div className={s.money}>
          <span className={s.sufix}>$</span>
          <span className={cx(s.amount, s.animation)}>{amount}</span>
        </div>
        <div className={s.typeWarp}>
          <div className={s.typeBody}>
            {/* 通过 payType 判断，是展示收入账单类型，还是支出账单类型 */}
            {(payType == 'expense' ? expense : income).map((item) => (
              <div onClick={() => setCurrentType(item)} key={item.id} className={s.typeItem}>
                {/* 收入和支出的字体颜色，以及背景颜色通过 payType 区分，并且设置高亮 */}
                <span
                  className={cx({
                    [s.iconfontWrap]: true,
                    [s.expense]: payType == 'expense',
                    [s.income]: payType == 'income',
                    [s.active]: currentType.id == item.id,
                  })}>
                  <CustomIcon className={s.iconfont} type={typeMap[item.id].icon} />
                </span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={s.remark}>
          {showRemark ? (
            <Input
              autoHeight
              showLength
              maxLength={50}
              type='text'
              rows={3}
              value={remark}
              placeholder='请输入备注信息'
              onChange={(val) => setRemark(val)}
              onBlur={() => setShowRemark(false)}
            />
          ) : (
            <span onClick={() => setShowRemark(true)}>{remark || '添加备注'}</span>
          )}
        </div>
        <Keyboard type='price' onKeyClick={(value) => handleMoney(value)} />
      </div>
    </Popup>
  );
});

export default PopupAddBill;
