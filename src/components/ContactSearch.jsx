import React, { useState, useEffect } from 'react';
import styles from '../css/DealForm.module.css';
import Modal from './Modal';
import CreateContact from './CreateContact';
import DealForm from './DealForm';
import Toast from './Toast';
import RecurringPlanForm from './RecurringPlanForm';
const associateDealFields = [
    { name: 'contact', label: 'Contact *', type: 'dropdown', options: ['Aghil', 'Anwin', 'Anna'] },
    // { name: 'recurring plan', label: 'Recurring Plan *', type: 'dropdown', options: ['Plan 1', 'Plan 2', 'Plan 3'] },
];

const ContactSearch = () => {
    const [formData, setFormData] = useState({});
    const [activeDropdown, setActiveDropdown] = useState({});
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [showDealForm, setShowDealForm] = useState(false);
    const [showRecurringPlanForm, setShowRecurrigPlanForm] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const areBothFieldsFilled = associateDealFields.every(field => {
            return field.type === 'dropdown' ? !!formData[field.name] : true;
        });
        setIsFormValid(areBothFieldsFilled);
    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDropdownChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'contact') {
            setIsPlanModalOpen(true); // Open modal when contact is selected
        }
    };

    const handleDropdownToggle = (name) => {
        setActiveDropdown(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handlePlanSelect = (planType) => {
        console.log(`Selected plan: ${planType}`);
        setIsPlanModalOpen(false); // Close modal after selection
    };
    const handleOneTimePlan = () => {
        setIsPlanModalOpen(false);
        // setContactSearch(false)
        setShowDealForm(true);

    }

    const handleRecurringPlan = () => {
        setIsPlanModalOpen(false);
        // setContactSearch(false)
        setShowRecurrigPlanForm(true);
    }
    const handleSubmit = () => {
        console.log('Form Data:', formData);
        setToast('Deal associated successfully!');

        setTimeout(() => {
            setToast(null);
            setShowDealForm(true);
        }, 1000);

        setFormData({});
        setActiveDropdown({});
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (showDealForm) {
        return <DealForm />;
    }

    if (showRecurringPlanForm) {
        return <RecurringPlanForm />
    }

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.associateHeading}>Manual Posting</h2>
            {associateDealFields.map((field, index) => (
                <div key={index} className={styles.formGroup}>
                    <label className={styles.label}>{field.label}</label>
                    {field.type === 'dropdown' ? (
                        <SearchableDropdown
                            name={field.name}
                            options={field.options}
                            isOpen={activeDropdown[field.name] || false}
                            onSelect={(value) => {
                                handleDropdownChange(field.name, value);
                                setActiveDropdown(prev => ({ ...prev, [field.name]: false }));
                            }}
                            onToggle={() => handleDropdownToggle(field.name)}
                            openModal={() => setIsModalOpen(true)}
                            selectedOption={formData[field.name] || ''} 
                        />
                    ) : (
                        <InputField
                            type={field.type}
                            name={field.name}
                            value={formData[field.name] || ''} // Ensure value reflects formData
                            onChange={handleInputChange}
                        />
                    )}
                </div>
            ))}

            <button
                className={`${styles.submitButton} ${!isFormValid ? styles.disabledButton : ''}`}
                onClick={handleSubmit}
                disabled={!isFormValid}
            >
                Create
            </button>

            {/* Plan Selection Modal */}
            <Modal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)}>
                <div className={styles.planModalContent}>
                    <h3 className={styles.planHeading}>Please select Frequency</h3>
                    <div className={styles.planButtonContainer}>
                        <button className={styles.planButton} onClick={handleOneTimePlan}>
                            One Time Plan
                        </button>
                        <button className={styles.planButton} onClick={handleRecurringPlan}>
                            Recurring Plan
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <CreateContact onClose={handleCloseModal} />
            </Modal>

            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
    );
};

const InputField = ({ type, name, value, onChange }) => (
    <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={styles.inputField}
        required
    />
);

const SearchableDropdown = ({ name, options, isOpen, onSelect, onToggle, openModal, selectedOption }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOptionClick = (option) => {
        onSelect(option);
    };

    return (
        <div className={styles.dropdown}>
            <div
                className={`${styles.dropdownHeader} ${isOpen ? styles.open : ''} ${selectedOption ? styles.selected : styles.placeholder}`}
                onClick={onToggle}
            >
                {selectedOption || `Select ${name}`}
            </div>
            {isOpen && (
                <div className={styles.dropdownMenu}>
                    <input
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.dropdownSearch}
                    />
                    <ul>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <li key={index} onClick={() => handleOptionClick(option)}>
                                    {option}
                                </li>
                            ))
                        ) : (
                            <div className={styles.noRecordsContainer}>
                                    <li className={styles.noRecords}>No records found</li>
                                    <button onClick={openModal} className={styles.createButton}>
                                        Create contact
                                    </button>
                                </div>

                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ContactSearch;








